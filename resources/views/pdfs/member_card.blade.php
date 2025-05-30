<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <title>Kartu Member</title>
    <style>
        @page {
            margin: 0;
        }

        html,
        body {
            margin: 0;
            padding: 10pt;
            width: 200pt;
            height: 110pt;
            box-sizing: border-box;
        }

        .card {
            border: 1px solid #000;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            padding: 10pt;
        }

        h3 {
            margin: 0 0 5pt 0;
            font-size: 14pt;
        }

        p {
            margin: 4pt 0;
            font-size: 10pt;
        }

        .qr-code {
            margin-top: 10px;
        }
    </style>
</head>

<body>
    <div class="card">
        <h3>Kartu Member</h3>
        <p><strong>Nama:</strong> {{ $memberCard->user->name }}</p>
        <p><strong>Nomor:</strong> {{ $memberCard->card_number }}</p>
        <p><strong>Tanggal Dibuat:</strong> {{ $memberCard->created_at->format('d M Y') }}</p>

        <div class="qr-code">
            <img src="data:image/svg+xml;base64,{{ $qrCode }}" alt="QR Code" />
        </div>
    </div>
</body>

</html>
