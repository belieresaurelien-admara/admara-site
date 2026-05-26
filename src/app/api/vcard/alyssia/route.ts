export const runtime = 'nodejs';

const VCARD = [
  'BEGIN:VCARD',
  'VERSION:3.0',
  'N:Mezaache;Alyssia;;;',
  'FN:Alyssia Mezaache',
  'ORG:ADMARA Studio',
  'TITLE:Co-founder — Art direction',
  'EMAIL;TYPE=WORK:alyssia@admara-studio.com',
  'URL:https://admara-studio.com',
  'NOTE:LINE: @admara-alyssia',
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
