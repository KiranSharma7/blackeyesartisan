Get-ChildItem -Path src -Recurse -Filter *.tsx | ForEach-Object {
     = C:/Users/black/OneDrive/Desktop/Code/blackeyesartisan.com/storefront.FullName
     = [System.IO.File]::ReadAllText()
    if (.Contains("from '@/components/ui")) {
         = 
         = .Replace("from '@/components/ui/button'", "from '@/components/retroui/Button'")
         = .Replace("from '@/components/ui/card'", "from '@/components/retroui/Card'")
         = .Replace("from '@/components/ui/badge'", "from '@/components/retroui/Badge'")
         = .Replace("from '@/components/ui/input'", "from '@/components/retroui/Input'")
         = .Replace("from '@/components/ui/select'", "from '@/components/retroui/Select'")
         = .Replace("from '@/components/ui'", "from '@/components/retroui/Button'")
        if ( -ne ) {
            [System.IO.File]::WriteAllText(, )
            Write-Output "Modified: "
        }
    }
}