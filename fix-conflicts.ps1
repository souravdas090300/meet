# PowerShell script to resolve merge conflicts by keeping the "stashed changes" version

$files = @(
    "index.html",
    "src\main.jsx",
    "src\App.jsx", 
    "src\App.css",
    "src\index.css",
    "src\mock-data.js",
    "src\components\CitySearch.jsx",
    "src\components\Event.jsx",
    "src\components\EventChart.jsx", 
    "src\components\EventList.jsx",
    "src\components\NumberOfEvents.jsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Processing $file..."
        
        # Read the file content
        $content = Get-Content $file -Raw
        
        # Check if it has merge conflicts
        if ($content -match '<<<<<<< Updated upstream') {
            # Split by conflict markers and keep only the "stashed changes" sections
            $sections = $content -split '<<<<<<< Updated upstream'
            $newContent = $sections[0]  # Keep content before first conflict
            
            for ($i = 1; $i -lt $sections.Count; $i++) {
                $section = $sections[$i]
                if ($section -match '=======(.*)>>>>>>> Stashed changes') {
                    # Extract the stashed changes part
                    $stashedPart = $matches[1]
                    $newContent += $stashedPart
                }
            }
            
            # Write the resolved content back
            $newContent | Set-Content $file -NoNewline
            Write-Host "Resolved conflicts in $file"
        } else {
            Write-Host "No conflicts found in $file"
        }
    } else {
        Write-Host "File not found: $file"
    }
}

Write-Host "Conflict resolution complete!"
