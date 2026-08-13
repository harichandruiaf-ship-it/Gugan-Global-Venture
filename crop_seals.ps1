Add-Type -AssemblyName System.Drawing
$srcPath = "C:\Users\HarichandruThirumuru\.gemini\antigravity-ide\brain\6f2f9460-31dc-4a1b-b8be-15914d314bcf\media__1786644865350.png"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)

$slices = @(
    @{ name = "cert_seal_spices_board.png"; x = 45; y = 15; w = 150; h = 180 },
    @{ name = "cert_seal_fssai.png"; x = 200; y = 30; w = 155; h = 150 },
    @{ name = "cert_seal_iec.png"; x = 365; y = 15; w = 150; h = 180 },
    @{ name = "cert_seal_iopepc.png"; x = 520; y = 15; w = 155; h = 180 },
    @{ name = "cert_seal_fda.png"; x = 685; y = 15; w = 150; h = 180 },
    @{ name = "cert_seal_iso.png"; x = 840; y = 15; w = 150; h = 180 }
)

foreach ($s in $slices) {
    $rect = New-Object System.Drawing.Rectangle($s.x, $s.y, $s.w, $s.h)
    $cropped = $src.Clone($rect, $src.PixelFormat)
    $destPath = Join-Path "assets" $s.name
    $cropped.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $cropped.Dispose()
    Write-Output "Saved $destPath"
}
$src.Dispose()
