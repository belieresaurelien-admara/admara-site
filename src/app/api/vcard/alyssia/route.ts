export const runtime = 'nodejs';

const VCARD = [
  'BEGIN:VCARD',
  'VERSION:3.0',
  'N:Mezaache;Alyssia;;;',
  'FN:Alyssia Mezaache',
  'ORG:ADMARA Studio',
  'TITLE:Co-founder — Art direction',
  'TEL;TYPE=CELL,VOICE:+66954758972',
  'EMAIL;TYPE=WORK:alyssia@admara-studio.com',
  'URL:https://admara-studio.com',
  'URL;TYPE=WhatsApp:https://wa.me/66954758972',
  'URL;TYPE=LINE:https://line.me/ti/p/_5B9jtA2-k',
  'NOTE:WhatsApp: +66 95 475 8972 — LINE: @admara-alyssia',
  'END:VCARD'
].join('\r\n');

export async function GET() {
  return new Response(VCARD, {
    headers: {
      'content-type': 'text/vcard; charset=utf-8',
      'content-disposition': 'attachment; filename="alyssia-mezaache.vcf"',
      'cache-control': 'public, max-age=3600'
    }
  });
}
