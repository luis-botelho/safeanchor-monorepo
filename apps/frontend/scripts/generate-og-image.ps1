# Gera a imagem de compartilhamento (Open Graph / Twitter) do SafeAnchor.
# Uso (Windows, PowerShell): powershell -File apps/frontend/scripts/generate-og-image.ps1
param(
  [string]$OutputPath = (Join-Path $PSScriptRoot "../public/og-image.png")
)

Add-Type -AssemblyName System.Drawing

$width = 1200
$height = 630
$navy = [System.Drawing.Color]::FromArgb(16, 42, 67)
$deep = [System.Drawing.Color]::FromArgb(18, 60, 67)
$teal = [System.Drawing.Color]::FromArgb(22, 125, 131)
$mist = [System.Drawing.Color]::FromArgb(242, 246, 245)

$bitmap = New-Object System.Drawing.Bitmap($width, $height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$graphics.Clear($navy)

# Linhas diagonais discretas: textura sem competir com o conteúdo.
$gridPen = New-Object System.Drawing.Pen($deep, 2)
for ($x = -600; $x -lt $width; $x += 64) {
  $graphics.DrawLine($gridPen, $x, $height, ($x + $height), 0)
}

# Marca: âncora em traço grosso, legível também em miniatura.
$whitePen = New-Object System.Drawing.Pen($mist, 10)
$whitePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$whitePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$whitePen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
$graphics.DrawEllipse($whitePen, 88, 208, 90, 90)
$graphics.DrawLine($whitePen, 133, 298, 133, 502)
$graphics.DrawLine($whitePen, 68, 348, 198, 348)
$graphics.DrawLine($whitePen, 133, 502, 65, 438)
$graphics.DrawLine($whitePen, 133, 502, 201, 438)
$graphics.DrawLine($whitePen, 65, 438, 42, 470)
$graphics.DrawLine($whitePen, 201, 438, 224, 470)

$tealPen = New-Object System.Drawing.Pen($teal, 9)
$tealPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$tealPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$graphics.DrawLine($tealPen, 56, 542, 112, 524)
$graphics.DrawLine($tealPen, 112, 524, 168, 542)
$graphics.DrawLine($tealPen, 168, 542, 224, 524)

$whiteBrush = New-Object System.Drawing.SolidBrush($mist)
$tealBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(96, 196, 198))

$titleFont = New-Object System.Drawing.Font("Segoe UI Semibold", 76, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$subtitleFont = New-Object System.Drawing.Font("Segoe UI", 36, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$detailFont = New-Object System.Drawing.Font("Segoe UI", 26, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$urlFont = New-Object System.Drawing.Font("Segoe UI", 22, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)

$graphics.DrawString("SafeAnchor", $titleFont, $whiteBrush, 300, 176)
$graphics.DrawString("Gestão náutica com clareza", $subtitleFont, $whiteBrush, 302, 282)
$graphics.DrawString("Frota · Manutenção · Documentos · Inspeções", $detailFont, $tealBrush, 302, 354)
$graphics.DrawString(" Demonstração pública: luis-botelho.github.io/safeanchor-monorepo/", $urlFont, $whiteBrush, 300, 520)

$bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$bitmap.Dispose()

Write-Output "OG image gerada: $OutputPath"
