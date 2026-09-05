Add-Type -AssemblyName System.Drawing
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

function Draw-ProjectCover {
    param(
        [string]$OutputPath,
        [string]$Category,
        [string]$Title,
        [string]$Subtitle,
        [string[]]$Badges,
        [string]$AccentColorHex,
        [string[]]$CodeLines
    )

    $w = 1200
    $h = 675
    $bmp = [System.Drawing.Bitmap]::new($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    # Background pure black #000000
    $bgBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#000000"))
    $g.FillRectangle($bgBrush, 0, 0, $w, $h)

    # Subtle grid lines
    $gridPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(35, 255, 255, 255), 1)
    for ($x = 0; $x -lt $w; $x += 40) {
        $g.DrawLine($gridPen, $x, 0, $x, $h)
    }
    for ($y = 0; $y -lt $h; $y += 40) {
        $g.DrawLine($gridPen, 0, $y, $w, $y)
    }

    # Window Container
    $cardBg = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#080D14"))
    $cardBorder = [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml($AccentColorHex), 2)
    
    $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $r = 24
    $path.AddArc(50, 45, $r*2, $r*2, 180, 90)
    $path.AddArc(1150 - $r*2, 45, $r*2, $r*2, 270, 90)
    $path.AddArc(1150 - $r*2, 630 - $r*2, $r*2, $r*2, 0, 90)
    $path.AddArc(50, 630 - $r*2, $r*2, $r*2, 90, 90)
    $path.CloseFigure()
    $g.FillPath($cardBg, $path)
    $g.DrawPath($cardBorder, $path)

    # Window Dots
    $dotRed = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#FF5F56"))
    $dotYellow = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#FFBD2E"))
    $dotGreen = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#27C93F"))
    $g.FillEllipse($dotRed, 75, 68, 14, 14)
    $g.FillEllipse($dotYellow, 97, 68, 14, 14)
    $g.FillEllipse($dotGreen, 119, 68, 14, 14)

    # Window Title
    $fontMonoSmall = [System.Drawing.Font]::new("Consolas", [float]11, [System.Drawing.FontStyle]::Regular)
    $textMutedBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#64748B"))
    $g.DrawString("project://github.com/Peo051", $fontMonoSmall, $textMutedBrush, 150, 67)

    # Accent Pill top right
    $accentBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($AccentColorHex))
    $pillPath = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $pillPath.AddArc(970, 62, 24, 24, 90, 180)
    $pillPath.AddArc(1110, 62, 24, 24, 270, 180)
    $pillPath.CloseFigure()
    $g.FillPath($accentBrush, $pillPath)

    # Content Left Side
    $fontCategory = [System.Drawing.Font]::new("Consolas", [float]12, [System.Drawing.FontStyle]::Bold)
    $g.DrawString($Category, $fontCategory, $accentBrush, 90, 135)

    $fontTitle = [System.Drawing.Font]::new("Segoe UI", [float]32, [System.Drawing.FontStyle]::Bold)
    $textWhite = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#FFFFFF"))
    $g.DrawString($Title, $fontTitle, $textWhite, 90, 170)

    $fontSub = [System.Drawing.Font]::new("Segoe UI", [float]13, [System.Drawing.FontStyle]::Regular)
    $textSubBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#94A3B8"))
    $rectSub = [System.Drawing.RectangleF]::new(90, 240, 560, 60)
    $g.DrawString($Subtitle, $fontSub, $textSubBrush, $rectSub)

    # Tech Badges bottom left
    $bx = 90
    $by = 540
    $fontBadge = [System.Drawing.Font]::new("Consolas", [float]10, [System.Drawing.FontStyle]::Bold)
    $badgeBg = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#0D1B2A"))
    $badgeBorder = [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml($AccentColorHex), 1.2)
    
    foreach ($b in $Badges) {
        $size = $g.MeasureString($b, $fontBadge)
        $bw = $size.Width + 24
        $bh = 34
        if ($bx + $bw -gt 680) {
            $bx = 90
            $by += 42
        }
        $bRect = [System.Drawing.RectangleF]::new($bx, $by, $bw, $bh)
        $g.FillRectangle($badgeBg, $bRect)
        $g.DrawRectangle($badgeBorder, $bx, $by, $bw, $bh)
        $g.DrawString($b, $fontBadge, $textWhite, ($bx + 12), ($by + 8))
        $bx += $bw + 12
    }

    # Code Window Right Side
    $cwX = 690
    $cwY = 130
    $cwW = 430
    $cwH = 460
    $cwBg = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#05090F"))
    $cwPen = [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml($AccentColorHex), 1.4)
    
    $cwPath = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $cwPath.AddArc($cwX, $cwY, 28, 28, 180, 90)
    $cwPath.AddArc($cwX + $cwW - 28, $cwY, 28, 28, 270, 90)
    $cwPath.AddArc($cwX + $cwW - 28, $cwY + $cwH - 28, 28, 28, 0, 90)
    $cwPath.AddArc($cwX, $cwY + $cwH - 28, 28, 28, 90, 90)
    $cwPath.CloseFigure()
    $g.FillPath($cwBg, $cwPath)
    $g.DrawPath($cwPen, $cwPath)

    # Draw Code Text
    $fontCode = [System.Drawing.Font]::new("Consolas", [float]10.5, [System.Drawing.FontStyle]::Regular)
    $lineY = $cwY + 22
    foreach ($line in $CodeLines) {
        $cBrush = $textWhite
        if ($line.StartsWith("//") -or $line.StartsWith("#")) {
            $cBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#64748B"))
        } elseif ($line.Contains("def ") -or $line.Contains("class ") -or $line.Contains("return ") -or $line.Contains("await ") -or $line.Contains("import ")) {
            $cBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#A78BFA"))
        } elseif ($line.Contains("=") -or $line.Contains("(") -or $line.Contains(")")) {
            $cBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#38BDF8"))
        } elseif ($line.Contains("[9") -or $line.Contains("[ 1")) {
            $cBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#34D399"))
        }
        $g.DrawString($line, $fontCode, $cBrush, ($cwX + 20), $lineY)
        $lineY += 24
    }

    $bmp.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Output "Saved clean cover to $OutputPath"
}

# 1. CodeSense AI Cover
Draw-ProjectCover `
    -OutputPath "assets/projects/codesense/cover.png" `
    -Category "APPLIED AI // ADAPTIVE TUTOR // FULLSTACK" `
    -Title "CodeSense AI" `
    -Subtitle "Adaptive C# OOP Programming Tutor with Socratic Reasoning and Progressive Hints" `
    -Badges @("Next.js 14", "TypeScript", "FastAPI", "PostgreSQL", "Firebase Auth", "LLM APIs") `
    -AccentColorHex "#22D3EE" `
    -CodeLines @(
        "// Socratic Tutoring & Progressive Hint Engine",
        "async def generate_socratic_hint(code: str, err: str):",
        "    ast = await csharp_parser.diagnose(code)",
        "    scaffold = build_socratic_prompt(ast, level=tier)",
        "    ",
        "    # Progressive hint generation (No raw solutions)",
        "    hint = await llm_engine.generate(",
        "        prompt=scaffold,",
        "        guardrails=['no_full_code', 'socratic_inquiry']",
        "    )",
        "    return HintResponse(tier=tier, guidance=hint)"
    )

# 2. Sign Language Cover
Draw-ProjectCover `
    -OutputPath "assets/projects/sign-language/cover.png" `
    -Category "COMPUTER VISION // APPLIED AI // REAL-TIME" `
    -Title "Sign Language Recognition" `
    -Subtitle "Real-Time Hand Sign Classification with YOLOv8, OpenCV and Top-3 Confidence HUD" `
    -Badges @("Python", "YOLOv8", "OpenCV", "PyTorch", "CNN Classification", "NumPy") `
    -AccentColorHex "#34D399" `
    -CodeLines @(
        "// YOLOv8 Real-Time Webcam Classification",
        "model = YOLO('best.pt')",
        "cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)",
        "while cap.isOpened():",
        "    success, frame = cap.read()",
        "    results = model(frame, stream=True)",
        "    top3 = get_top_k(results[0].probs, k=3)",
        "    draw_hud(frame, top3, fps=30.2)",
        "    ",
        "    # Live HUD Confidence Output",
        "    [98.4%] Class '0'  [====================]",
        "    [ 1.2%] Class 'O'  [=                   ]"
    )
