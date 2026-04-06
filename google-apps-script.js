/**
 * SocialBiz 엔터프라이즈 세팅 대행 신청 - Google Apps Script
 *
 * [배포 방법]
 * 1. https://script.google.com 접속
 * 2. 새 프로젝트 생성
 * 3. 이 코드 전체를 붙여넣기
 * 4. SPREADSHEET_ID 를 실제 스프레드시트 ID로 교체
 * 5. 상단 메뉴 → 배포 → 새 배포
 *    - 유형: 웹 앱
 *    - 다음 사용자로 실행: 나(본인)
 *    - 액세스 권한: 모든 사용자
 * 6. 배포 → 웹 앱 URL 복사
 * 7. enterprise-setup.html 의 APPS_SCRIPT_URL 에 붙여넣기
 */

// ← 여기에 스프레드시트 ID 입력 (URL에서 /d/ 뒤의 긴 문자열)
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';

// 헤더 행 (첫 실행 시 자동 생성)
const HEADERS = [
  '제출_시간',
  '담당자_이름',
  '연락처',
  '이메일',
  '회사_브랜드명',
  '인스타그램_URL',
  '계정_유형',
  '선택_기능',
  '키워드_목록',
  '키워드_설명',
  '이미지_편집_필요',
  '이미지_요청사항',
  '세팅_희망_완료일',
  '긴급_여부',
  '추가_요청사항',
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheets()[0];

    // 헤더가 없으면 첫 행에 추가
    if (sheet.getLastRow() === 0) {
      // URL 필드는 동적이므로 헤더에 추가
      const urlKeys = Object.keys(data).filter(k => k.startsWith('발송_URL_'));
      sheet.appendRow([...HEADERS, ...urlKeys]);
    }

    // 데이터 행 구성
    const urlKeys = Object.keys(data).filter(k => k.startsWith('발송_URL_'));
    const row = [
      data['제출_시간'] || new Date().toLocaleString('ko-KR'),
      data['담당자_이름'] || '',
      data['연락처'] || '',
      data['이메일'] || '',
      data['회사_브랜드명'] || '',
      data['인스타그램_URL'] || '',
      data['계정_유형'] || '',
      data['선택_기능'] || '',
      data['키워드_목록'] || '',
      data['키워드_설명'] || '',
      data['이미지_편집_필요'] || '',
      data['이미지_요청사항'] || '',
      data['세팅_희망_완료일'] || '',
      data['긴급_여부'] || '',
      data['추가_요청사항'] || '',
      ...urlKeys.map(k => data[k] || ''),
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
