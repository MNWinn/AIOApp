# Save this script as list_files.ps1

# Function to print the directory tree
function Get-Tree {
    param(
        [string]$Path = ".",
        [int]$Depth = 0
    )

    $items = Get-ChildItem -Path $Path -Recurse -Directory | Where-Object { $_.FullName -notlike "*\node_modules*" }
    foreach ($item in $items) {
        $indent = " " * ($Depth * 4)
        Write-Output ("{0}{1}" -f $indent, $item.Name)

        # Recursively call the function for subdirectories
        Get-Tree -Path $item.FullName -Depth ($Depth + 1)
    }

    $files = Get-ChildItem -Path $Path -File | Where-Object { $_.FullName -notlike "*\node_modules*" }
    foreach ($file in $files) {
        $indent = " " * ($Depth * 4)
        Write-Output ("{0}{1}" -f $indent, $file.Name)
    }
}

# Call the function with the current directory
Get-Tree -Path "."
