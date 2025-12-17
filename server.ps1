param(
  [int]$Port = 8000
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Add-Type -AssemblyName System.Net
Add-Type -AssemblyName System.Drawing
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Output "Backend + estáticos en http://localhost:$Port/"

$dataDir = Join-Path $root 'data'
if (-not (Test-Path $dataDir)) { New-Item -ItemType Directory -Path $dataDir | Out-Null }
$productsPath = Join-Path $dataDir 'products.json'
if (-not (Test-Path $productsPath)) { Set-Content -Path $productsPath -Value '[]' }
$ordersPath = Join-Path $dataDir 'orders.json'
if (-not (Test-Path $ordersPath)) { Set-Content -Path $ordersPath -Value '[]' }
$usersPath = Join-Path $dataDir 'users.json'
if (-not (Test-Path $usersPath)) { Set-Content -Path $usersPath -Value '[]' }
$tokenPath = Join-Path $dataDir 'admin_token.txt'
if (-not (Test-Path $tokenPath)) { $tok = [Guid]::NewGuid().ToString(); Set-Content -Path $tokenPath -Value $tok; Write-Output "Admin token: $tok" } else { $tok = (Get-Content -Path $tokenPath -Raw).Trim() }
$pinPath = Join-Path $dataDir 'admin_pin.txt'
if (-not (Test-Path $pinPath)) { $pin = (Get-Random -Minimum 100000 -Maximum 999999).ToString(); Set-Content -Path $pinPath -Value $pin; Write-Output "Admin PIN: $pin" } else { $pin = (Get-Content -Path $pinPath -Raw).Trim() }

function Json($obj) { ConvertTo-Json $obj -Depth 10 }
function ReadBody($ctx) { $sr = New-Object System.IO.StreamReader($ctx.Request.InputStream, $ctx.Request.ContentEncoding); $body = $sr.ReadToEnd(); $sr.Dispose(); return $body }
function WriteText($ctx, $status, $text, $ctype='text/plain') { $bytes = [System.Text.Encoding]::UTF8.GetBytes($text); $ctx.Response.StatusCode = $status; $ctx.Response.ContentType = $ctype; $ctx.Response.OutputStream.Write($bytes,0,$bytes.Length); $ctx.Response.Close() }
function WriteJson($ctx, $status, $obj) { WriteText $ctx $status (Json $obj) 'application/json' }
function AllowCors($ctx) {
  $ctx.Response.Headers['Access-Control-Allow-Origin'] = '*'
  $ctx.Response.Headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
  $ctx.Response.Headers['Access-Control-Allow-Headers'] = 'Content-Type, X-Admin-Token, X-Admin-Pin, X-Session-Token'
}
function GetHeader($ctx, $name) { $v = $ctx.Request.Headers[$name]; if ($null -eq $v) { return '' } else { return $v.Trim() } }
function IsAdmin($ctx) { return (GetHeader $ctx 'X-Admin-Token') -eq $tok }
function IsPin($ctx) { return (GetHeader $ctx 'X-Admin-Pin') -eq $pin }
function LoadUsers() { try { (Get-Content -Raw -Path $usersPath | ConvertFrom-Json) } catch { @() } }
function SaveUsers($list) { $json = Json $list; Set-Content -Path $usersPath -Value $json }
function GetUserByToken($token) { $users = @(LoadUsers); if (-not $token) { return $null } ($users | Where-Object { $_.token -eq $token }) }
function IsRole($ctx, $roles) { $t = GetHeader $ctx 'X-Session-Token'; $u = GetUserByToken $t; if ($null -eq $u) { return $false } return ($roles -contains ($u.role)) }
function LoadProducts() { try { (Get-Content -Raw -Path $productsPath | ConvertFrom-Json) } catch { @() } }
function SaveProducts($list) { $json = Json $list; Set-Content -Path $productsPath -Value $json }
function LoadOrders() { try { (Get-Content -Raw -Path $ordersPath | ConvertFrom-Json) } catch { @() } }
function SaveOrders($list) { $json = Json $list; Set-Content -Path $ordersPath -Value $json }
function DetectMime($path) {
  switch ([System.IO.Path]::GetExtension($path).ToLower()) {
    '.html' { 'text/html' }
    '.css' { 'text/css' }
    '.js' { 'application/javascript' }
    '.ico' { 'image/x-icon' }
    '.png' { 'image/png' }
    '.jpg' { 'image/jpeg' }
    '.jpeg' { 'image/jpeg' }
    '.svg' { 'image/svg+xml' }
    default { 'application/octet-stream' }
  }
}

function SaveResizedImage($bytes, $outPath, $width, $height) {
  $ms = New-Object System.IO.MemoryStream($bytes)
  $img = [System.Drawing.Image]::FromStream($ms)
  $bmp = New-Object System.Drawing.Bitmap($width, $height)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::White)
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $scale = [Math]::Min($width / $img.Width, $height / $img.Height)
  $newW = [int]([Math]::Round($img.Width * $scale))
  $newH = [int]([Math]::Round($img.Height * $scale))
  $x = [int]([Math]::Round(($width - $newW) / 2))
  $y = [int]([Math]::Round(($height - $newH) / 2))
  $g.DrawImage($img, $x, $y, $newW, $newH)
  $enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
  $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 85)
  $bmp.Save($outPath, $enc, $ep)
  $g.Dispose(); $bmp.Dispose(); $img.Dispose(); $ms.Dispose()
}

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    AllowCors $ctx
    if ($ctx.Request.HttpMethod -eq 'OPTIONS') { WriteText $ctx 204 '' 'text/plain'; continue }
    $local = $ctx.Request.Url.LocalPath
    if ($local.StartsWith('/api/admin/check')) {
      $ok = $false
      if (IsPin $ctx) { $ok = $true }
      else {
        try {
          $qpin = $ctx.Request.QueryString['pin']
          if ($qpin -and ($qpin.Trim() -eq $pin)) { $ok = $true }
          else {
            $body = ReadBody $ctx
            if ($body -and $body.Trim().Length -gt 0) {
              $bd = $body | ConvertFrom-Json
              $bpin = ("" + $bd.pin).Trim()
              if ($bpin -eq $pin) { $ok = $true }
            }
          }
        } catch {}
      }
      if ($ok) { WriteJson $ctx 200 @{ ok = $true } } else { WriteJson $ctx 401 @{ error = 'unauthorized' } }
      continue
    }
    elseif ($local.StartsWith('/api/upload')) {
      if (-not (IsAdmin $ctx)) { WriteJson $ctx 401 @{ error = 'unauthorized' }; continue }
      $imagenesDir = Join-Path $root 'imagenes'
      if (-not (Test-Path $imagenesDir)) { New-Item -ItemType Directory -Path $imagenesDir | Out-Null }
      $data = ReadBody $ctx | ConvertFrom-Json
      $baseName = ($data.filename -replace '[^a-zA-Z0-9_.-]', '_')
      if (-not $baseName) { $baseName = ('img_' + ([Guid]::NewGuid().ToString().Substring(0,8))) }
      $fn = [System.IO.Path]::ChangeExtension($baseName, '.jpg')
      $bytes = [Convert]::FromBase64String(($data.data))
      $outPath = Join-Path $imagenesDir $fn
      SaveResizedImage $bytes $outPath 600 600
      WriteJson $ctx 200 @{ url = "/imagenes/$fn" }
      continue
    }
    elseif ($local.StartsWith('/api/orders')) {
      $method = $ctx.Request.HttpMethod
      if ($method -eq 'GET') {
        if ($local.StartsWith('/api/orders/by-user')) {
          $email = $ctx.Request.QueryString['email']
          $list = @(LoadOrders)
          $out = $list | Where-Object { $_.user -eq $email }
          WriteJson $ctx 200 $out
        } else {
          if (-not (IsAdmin $ctx) -and -not (IsRole $ctx @('admin','contador'))) { WriteJson $ctx 401 @{ error = 'unauthorized' }; continue }
          $list = @(LoadOrders)
          WriteJson $ctx 200 $list
        }
      } elseif ($method -eq 'POST') {
        $data = ReadBody $ctx | ConvertFrom-Json
        $list = @(LoadOrders)
        $prods = @(LoadProducts)
        if (-not $data.items -or $data.items.Count -eq 0) { WriteJson $ctx 400 @{ error = 'missing items' }; continue }
        $insufficient = @()
        foreach ($it in $data.items) {
          $pid = $it.id
          $qty = [int]($it.qty)
          if ($qty -lt 1) { $qty = 1 }
          $p = $prods | Where-Object { $_.id -eq $pid }
          if (-not $p) { $insufficient += @{ id = $pid; reason = 'not_found' }; continue }
          $stock = [int]($p.stock)
          if ($stock -lt $qty) { $insufficient += @{ id = $pid; reason = 'stock'; have = $stock; need = $qty }
        }
        if ($insufficient.Count -gt 0) { WriteJson $ctx 400 @{ error = 'insufficient_stock'; details = $insufficient }; continue }
        foreach ($it in $data.items) {
          $pid = $it.id
          $qty = [int]($it.qty)
          if ($qty -lt 1) { $qty = 1 }
          for ($i=0; $i -lt $prods.Count; $i++) {
            if ($prods[$i].id -eq $pid) { $prods[$i].stock = ([int]($prods[$i].stock) - $qty); break }
          }
        }
        SaveProducts $prods
        $d = Get-Date
        $id = "ORD-{0}{1}{2}-{3}" -f $d.Year, ($d.Month.ToString('00')), ($d.Day.ToString('00')), (Get-Random -Minimum 1000 -Maximum 9999)
        if (-not $data.status) { $data | Add-Member -NotePropertyName status -NotePropertyValue 'Recibido' }
        $data | Add-Member -NotePropertyName id -NotePropertyValue $id -Force
        $data | Add-Member -NotePropertyName createdAt -NotePropertyValue ([int][double]((Get-Date -UFormat %s))) -Force
        $list += $data
        SaveOrders $list
        WriteJson $ctx 201 $data
      } elseif ($method -eq 'PUT') {
        if (-not (IsAdmin $ctx) -and -not (IsRole $ctx @('admin','contador'))) { WriteJson $ctx 401 @{ error = 'unauthorized' }; continue }
        $parts = $local.Trim('/').Split('/')
        if ($parts.Length -lt 3) { WriteJson $ctx 400 @{ error = 'missing id' }; continue }
        $id = $parts[2]
        $data = ReadBody $ctx | ConvertFrom-Json
        $list = @(LoadOrders)
        $updated = $false
        for ($i=0; $i -lt $list.Count; $i++) {
          if ($list[$i].id -eq $id) {
            if ($local.Contains('/status')) { $list[$i].status = $data.status }
            else { $list[$i] = $data }
            $updated = $true; break
          }
        }
        if (-not $updated) { WriteJson $ctx 404 @{ error = 'not found' }; continue }
        SaveOrders $list
        WriteJson $ctx 200 @{ ok = $true }
      } else { WriteJson $ctx 405 @{ error = 'method not allowed' } }
      continue
    }
    elseif ($local.StartsWith('/api/products')) {
      $parts = $local.Trim('/').Split('/')
      $method = $ctx.Request.HttpMethod
      $list = @(LoadProducts)
      if ($method -eq 'GET') {
        if ($parts.Length -gt 2) { $id = $parts[2]; $item = $list | Where-Object { $_.id -eq $id }; WriteJson $ctx 200 $item }
        else { WriteJson $ctx 200 $list }
      } elseif ($method -eq 'POST') {
        if (-not (IsAdmin $ctx) -and -not (IsRole $ctx @('admin','abastecimiento'))) { WriteJson $ctx 401 @{ error = 'unauthorized' }; continue }
        $data = ReadBody $ctx | ConvertFrom-Json
        if (-not $data.id) { $data | Add-Member -NotePropertyName id -NotePropertyValue ("prod_" + ([Guid]::NewGuid().ToString().Substring(0,8))) }
        $list += $data
        SaveProducts $list
        WriteJson $ctx 201 $data
      } elseif ($method -eq 'PUT') {
        if (-not (IsAdmin $ctx) -and -not (IsRole $ctx @('admin','abastecimiento'))) { WriteJson $ctx 401 @{ error = 'unauthorized' }; continue }
        if ($parts.Length -lt 3) { WriteJson $ctx 400 @{ error = 'missing id' }; continue }
        $id = $parts[2]
        $data = ReadBody $ctx | ConvertFrom-Json
        $updated = $false
        for ($i=0; $i -lt $list.Count; $i++) { if ($list[$i].id -eq $id) { $list[$i] = $data; $updated = $true; break } }
        if (-not $updated) { WriteJson $ctx 404 @{ error = 'not found' }; continue }
        SaveProducts $list
        WriteJson $ctx 200 $data
      } elseif ($method -eq 'DELETE') {
        if (-not (IsAdmin $ctx) -and -not (IsRole $ctx @('admin','abastecimiento'))) { WriteJson $ctx 401 @{ error = 'unauthorized' }; continue }
        if ($parts.Length -lt 3) { WriteJson $ctx 400 @{ error = 'missing id' }; continue }
        $id = $parts[2]
        $list = $list | Where-Object { $_.id -ne $id }
        SaveProducts $list
        WriteJson $ctx 200 @{ ok = $true }
      } else {
        WriteJson $ctx 405 @{ error = 'method not allowed' }
      }
      continue
    }
    elseif ($local.StartsWith('/api/users')) {
      $method = $ctx.Request.HttpMethod
      if ($method -eq 'GET') {
        if (-not (IsAdmin $ctx) -and -not (IsRole $ctx @('admin'))) { WriteJson $ctx 401 @{ error = 'unauthorized' }; continue }
        WriteJson $ctx 200 @(LoadUsers)
      } elseif ($method -eq 'POST') {
        if (-not (IsAdmin $ctx) -and -not (IsRole $ctx @('admin')) -and -not (IsPin $ctx)) { WriteJson $ctx 401 @{ error = 'unauthorized' }; continue }
        $data = ReadBody $ctx | ConvertFrom-Json
        if (-not $data.email -or -not $data.password -or -not $data.role) { WriteJson $ctx 400 @{ error = 'missing fields' }; continue }
        $users = @(LoadUsers)
        if ($users | Where-Object { $_.email -eq $data.email }) { WriteJson $ctx 409 @{ error = 'exists' }; continue }
        $data | Add-Member -NotePropertyName id -NotePropertyValue ([Guid]::NewGuid().ToString())
        if (-not $data.active) { $data | Add-Member -NotePropertyName active -NotePropertyValue $true }
        $users += $data
        SaveUsers $users
        WriteJson $ctx 201 $data
      } else { WriteJson $ctx 405 @{ error = 'method not allowed' } }
      continue
    }
    elseif ($local -match '^/api/users/([A-Za-z0-9-]+)/disable') {
      if (-not (IsAdmin $ctx)) { WriteJson $ctx 401 @{ error = 'unauthorized' }; continue }
      $id = ($local.Trim('/').Split('/'))[2]
      $users = @(LoadUsers)
      $updated = $false
      for ($i=0; $i -lt $users.Count; $i++) { if ($users[$i].id -eq $id) { $users[$i].active = $false; $updated = $true; break } }
      if (-not $updated) { WriteJson $ctx 404 @{ error = 'not found' }; continue }
      SaveUsers $users
      WriteJson $ctx 200 @{ ok = $true }
      continue
    }
    elseif ($local -match '^/api/users/([A-Za-z0-9-]+)/enable') {
      if (-not (IsAdmin $ctx)) { WriteJson $ctx 401 @{ error = 'unauthorized' }; continue }
      $id = ($local.Trim('/').Split('/'))[2]
      $users = @(LoadUsers)
      $updated = $false
      for ($i=0; $i -lt $users.Count; $i++) { if ($users[$i].id -eq $id) { $users[$i].active = $true; $updated = $true; break } }
      if (-not $updated) { WriteJson $ctx 404 @{ error = 'not found' }; continue }
      SaveUsers $users
      WriteJson $ctx 200 @{ ok = $true }
      continue
    }
    elseif ($local.StartsWith('/api/auth/login')) {
      $data = ReadBody $ctx | ConvertFrom-Json
      $email = ("" + $data.email).Trim().ToLower()
      $password = ("" + $data.password).Trim()
      $users = @(LoadUsers)
      $u = $users | Where-Object { $_.email -eq $email -and $_.password -eq $password }
      if (-not $u) { WriteJson $ctx 401 @{ error = 'invalid' }; continue }
      $token = [Guid]::NewGuid().ToString()
      for ($i=0; $i -lt $users.Count; $i++) { if ($users[$i].email -eq $email) { $users[$i].token = $token; break } }
      SaveUsers $users
      WriteJson $ctx 200 @{ token = $token; role = $u.role; name = $u.name; email = $u.email }
      continue
    }
    elseif ($local.StartsWith('/api/auth/reset/request')) {
      $data = ReadBody $ctx | ConvertFrom-Json
      $email = ("" + $data.email).Trim().ToLower()
      $users = @(LoadUsers)
      $code = (Get-Random -Minimum 100000 -Maximum 999999).ToString()
      $set = $false
      for ($i=0; $i -lt $users.Count; $i++) { if ($users[$i].email -eq $email) { $users[$i].resetCode = $code; $users[$i].resetExpires = ([int][double]((Get-Date -UFormat %s))) + 900; $set = $true; break } }
      if (-not $set) { WriteJson $ctx 404 @{ error = 'not found' }; continue }
      SaveUsers $users
      WriteJson $ctx 200 @{ ok = $true; code = $code }
      continue
    }
    elseif ($local.StartsWith('/api/auth/reset/confirm')) {
      $data = ReadBody $ctx | ConvertFrom-Json
      $email = ("" + $data.email).Trim().ToLower()
      $code = ("" + $data.code).Trim()
      $newp = ("" + $data.newPassword)
      $now = [int][double]((Get-Date -UFormat %s))
      $users = @(LoadUsers)
      $ok = $false
      for ($i=0; $i -lt $users.Count; $i++) {
        $u = $users[$i]
        if ($u.email -eq $email -and $u.resetCode -eq $code -and $u.resetExpires -gt $now) { $users[$i].password = $newp; $users[$i].resetCode = $null; $users[$i].resetExpires = $null; $ok = $true; break }
      }
      if (-not $ok) { WriteJson $ctx 400 @{ error = 'invalid_code' }; continue }
      SaveUsers $users
      WriteJson $ctx 200 @{ ok = $true }
      continue
    }
    # estáticos
    if ($local.StartsWith('/api/')) { WriteJson $ctx 404 @{ error = 'not_found' }; continue }
    $rel = $local.TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($rel)) { $rel = 'index.html' }
    $path = Join-Path $root $rel
    if (-not (Test-Path $path)) { $path = Join-Path $root 'index.html' }
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $ctx.Response.ContentType = (DetectMime $path)
    $ctx.Response.OutputStream.Write($bytes,0,$bytes.Length)
    $ctx.Response.Close()
  } catch {
    # swallow to keep server alive
  }
}
