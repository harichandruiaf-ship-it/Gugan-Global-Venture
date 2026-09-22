<?php
/**
 * Gugan Global Venture - Ultra-Fast Server-Side Mailer for GoDaddy
 * 
 * Takes form submissions and delivers them via PHP mail() in <100ms.
 * Recipient: info@guganglobalventure.com
 */

// Allow cross-origin requests & set JSON response
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

// Support both JSON body and standard POST form data
$rawInput = file_get_contents("php://input");
$input = json_decode($rawInput, true);
if (!$input || !is_array($input)) {
    $input = $_POST;
}

// Honeypot spam check (if filled by bot, silently reject)
if (!empty($input['_honey'])) {
    echo json_encode(["success" => true, "message" => "Processed"]);
    exit;
}

$recipient = "info@guganglobalventure.com";
$subject = !empty($input['_subject']) ? strip_tags($input['_subject']) : "New B2B Inquiry - Gugan Global Venture";

$senderName  = !empty($input['name'])  ? htmlspecialchars(trim($input['name'])) : '';
$senderEmail = !empty($input['email']) ? filter_var(trim($input['email']), FILTER_VALIDATE_EMAIL) : '';

if (empty($senderName) || mb_strlen($senderName) < 2) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Please provide your full name."]);
    exit;
}

if (!$senderEmail) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Please provide a valid email address."]);
    exit;
}

// Extract specific fields for rich structured presentation
$refCode      = !empty($input['Inquiry_Reference_ID']) ? strip_tags($input['Inquiry_Reference_ID']) : ('GGV-' . date('Y') . '-' . rand(10000, 99999));
$company      = !empty($input['Company_Organization']) ? htmlspecialchars($input['Company_Organization']) : (!empty($input['company']) ? htmlspecialchars($input['company']) : 'Direct Trade Importer');
$phone        = !empty($input['Phone_WhatsApp']) ? htmlspecialchars($input['Phone_WhatsApp']) : (!empty($input['phone']) ? htmlspecialchars($input['phone']) : 'Not provided');
$destPort     = !empty($input['Destination_Port_Country']) ? htmlspecialchars($input['Destination_Port_Country']) : (!empty($input['destination_port']) ? htmlspecialchars($input['destination_port']) : (!empty($input['Required_Volume_and_Incoterms']) ? htmlspecialchars($input['Required_Volume_and_Incoterms']) : 'Direct Seaport Export (FOB / CIF)'));
$spiceCats    = !empty($input['Target_Spice_Products']) ? htmlspecialchars($input['Target_Spice_Products']) : (!empty($input['Selected_Spice_Products']) ? htmlspecialchars($input['Selected_Spice_Products']) : 'General Indian Spices');
$varieties    = !empty($input['Selected_Export_Varieties_Grades']) ? htmlspecialchars($input['Selected_Export_Varieties_Grades']) : (!empty($input['Selected_Export_Varieties']) ? htmlspecialchars($input['Selected_Export_Varieties']) : 'Export Grade Specification Requested');
$orderVolume  = !empty($input['Required_Volume_and_Incoterms']) ? htmlspecialchars($input['Required_Volume_and_Incoterms']) : (!empty($input['quantity_incoterms']) ? htmlspecialchars($input['quantity_incoterms']) : 'Quotation requested');
$clientNotes  = !empty($input['Client_Order_Notes_Specifications']) ? htmlspecialchars($input['Client_Order_Notes_Specifications']) : (!empty($input['message']) ? htmlspecialchars($input['message']) : 'No special packaging or moisture specifications provided.');
$timestamp    = date('l, d F Y - h:i A') . ' IST';

// Clean phone digits for WhatsApp URL
$cleanPhone = preg_replace('/[^0-9]/', '', $phone);
$waLink = !empty($cleanPhone) ? "https://wa.me/{$cleanPhone}" : "";

// Build Executive HTML Email Template
$emailBody = "
<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>New Export Inquiry - Gugan Global Venture</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #f1f5f9; padding: 30px 10px; }
    .main-card { background: #ffffff; margin: 0 auto; width: 100%; max-width: 640px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0; }
    .header { background: #0f172a; padding: 28px 32px; border-bottom: 3px solid #F5C60E; }
    .brand-kicker { font-size: 11px; font-weight: 700; color: #F5C60E; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; }
    .brand-title { font-size: 22px; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.01em; }
    .brand-sub { font-size: 13px; color: #94a3b8; margin-top: 4px; }
    .ribbon { background: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 12px 32px; display: flex; justify-content: space-between; font-size: 12px; }
    .content-block { padding: 28px 32px; }
    .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #C22E1A; margin: 20px 0 10px 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px; }
    .section-title:first-child { margin-top: 0; }
    .data-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    .data-table td { padding: 10px 0; vertical-align: top; border-bottom: 1px solid #f8fafc; }
    .data-label { width: 34%; font-size: 12.5px; font-weight: 600; color: #64748b; text-transform: capitalize; }
    .data-value { width: 66%; font-size: 13.5px; font-weight: 600; color: #0f172a; }
    .badge-tag { display: inline-block; background: #fef9c3; color: #854d0e; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; margin: 2px 4px 2px 0; border: 1px solid #fde047; }
    .variety-box { background: #fafaf9; border-left: 3px solid #C22E1A; padding: 12px 16px; border-radius: 6px; font-size: 13.5px; color: #1c1917; line-height: 1.5; margin: 6px 0 12px; }
    .notes-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; font-size: 13.5px; color: #334155; line-height: 1.6; margin: 8px 0 16px; }
    .actions-bar { padding: 20px 32px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; }
    .btn-action { display: inline-block; padding: 12px 22px; border-radius: 8px; font-size: 13.5px; font-weight: 700; text-decoration: none; margin: 4px 6px; }
    .btn-email { background: #0f172a; color: #ffffff !important; }
    .btn-whatsapp { background: #16a34a; color: #ffffff !important; }
    .footer { padding: 20px 32px; text-align: center; font-size: 11.5px; color: #94a3b8; line-height: 1.5; }
  </style>
</head>
<body>
  <div class='wrapper'>
    <div class='main-card'>
      <!-- Brand Header -->
      <div class='header'>
        <div class='brand-kicker'>COMMERCIAL EXPORT TRADE DESK</div>
        <div class='brand-title'>New B2B Spice Trade Inquiry</div>
        <div class='brand-sub'>Gugan Global Venture • Tuticorin & Chennai Port Gateway, India</div>
      </div>

      <!-- Reference Ribbon -->
      <table style='width:100%; background:#f8fafc; border-bottom:1px solid #e2e8f0; padding:12px 32px; font-size:12px;'>
        <tr>
          <td style='color:#64748b; font-weight:600;'>REFERENCE: <strong style='color:#0f172a; font-family:monospace;'>{$refCode}</strong></td>
          <td style='text-align:right; color:#16a34a; font-weight:700;'>SLA: Reply &lt; 24 Hours</td>
        </tr>
      </table>

      <!-- Content Area -->
      <div class='content-block'>
        <!-- Section 1: Buyer Profile -->
        <div class='section-title'>1. BUYER PROFILE & CONTACT DETAILS</div>
        <table class='data-table'>
          <tr>
            <td class='data-label'>Buyer Full Name:</td>
            <td class='data-value'>{$senderName}</td>
          </tr>
          <tr>
            <td class='data-label'>Company / Entity:</td>
            <td class='data-value'>{$company}</td>
          </tr>
          <tr>
            <td class='data-label'>Official Email:</td>
            <td class='data-value'><a href='mailto:{$senderEmail}' style='color:#2563eb; text-decoration:none;'>{$senderEmail}</a></td>
          </tr>
          <tr>
            <td class='data-label'>Phone / WhatsApp:</td>
            <td class='data-value'>{$phone}</td>
          </tr>
        </table>

        <!-- Section 2: Trade Specifications -->
        <div class='section-title'>2. INQUIRED SPICE COMMODITIES & DESTINATION</div>
        <table class='data-table'>
          <tr>
            <td class='data-label'>Destination Port:</td>
            <td class='data-value'><strong style='color:#C22E1A;'>{$destPort}</strong></td>
          </tr>
          <tr>
            <td class='data-label'>Target Spice Products:</td>
            <td class='data-value'>{$spiceCats}</td>
          </tr>
          <tr>
            <td class='data-label'>Required Volume:</td>
            <td class='data-value'>{$orderVolume}</td>
          </tr>
        </table>

        <div style='font-size:12px; font-weight:700; color:#64748b; text-transform:uppercase; margin-top:8px;'>Selected Varieties & Export Grades:</div>
        <div class='variety-box'>{$varieties}</div>

        <!-- Section 3: Notes -->
        <div class='section-title'>3. BUYER MESSAGE & ORDER NOTES</div>
        <div class='notes-box'>{$clientNotes}</div>
      </div>

      <!-- Action Buttons -->
      <div class='actions-bar'>
        <a href='mailto:{$senderEmail}?subject=Re:%20Gugan%20Global%20Venture%20Export%20Quotation%20[{$refCode}]' class='btn-action btn-email'>✉️ Reply by Email</a>
        " . (!empty($waLink) ? "<a href='{$waLink}' target='_blank' class='btn-action btn-whatsapp'>💬 Chat on WhatsApp</a>" : "") . "
      </div>

      <!-- Footer Compliance -->
      <div class='footer'>
        <!-- ISO Mention (Uncomment when certified):
        Gugan Global Venture • Spices Board RCMC Registered Exporter • ISO 22000 Certified<br>
        -->
        Gugan Global Venture • Spices Board RCMC Registered Exporter • FIEO Member<br>
        Received: {$timestamp} • Automated trade desk notification
      </div>
    </div>
  </div>
</body>
</html>";

// Headers
$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: Gugan Global Inquiry <no-reply@' . ($_SERVER['HTTP_HOST'] ?? 'guganglobalventure.com') . '>',
    'Reply-To: ' . $senderName . ' <' . $senderEmail . '>',
    'X-Mailer: PHP/' . phpversion()
];

$sent = @mail($recipient, $subject, $emailBody, implode("\r\n", $headers));

if ($sent) {
    echo json_encode(["success" => true, "message" => "Inquiry sent successfully."]);
} else {
    // If local PHP mail is unconfigured, return success=false
    echo json_encode(["success" => false, "message" => "Mail delivery error."]);
}
