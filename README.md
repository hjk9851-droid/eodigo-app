# 어디고? - TWA Android App

> **패키지명:** com.juchan.eodigo  
> **웹앱 주소:** https://heartfelt-griffin-2dc6c0.netlify.app  
> **설명:** 글을 몰라도, 스마트폰이 서툴러도 괜찮아요. 말 한마디면 어르신 곁에서 길을 찾아드립니다.

---

## 📁 폴더 구조

```
eodigo-app/
├── app/
│   └── src/main/
│       ├── AndroidManifest.xml   ← TWA 설정 핵심
│       └── res/
│           ├── drawable/         ← 스플래시 배경
│           ├── mipmap-*/         ← 아이콘 (자동 생성됨)
│           └── values/           ← 색상, 이름, 스타일
├── .github/workflows/build.yml   ← GitHub Actions 자동 빌드
├── gradle/wrapper/               ← Gradle 설정
├── icon.svg                      ← 앱 아이콘 원본
├── twa-manifest.json             ← bubblewrap 설정
├── build.gradle                  ← 프로젝트 빌드 설정
└── app/build.gradle              ← 앱 빌드 + 서명 설정
```

---

## 🔑 STEP 1: 서명 키 생성 (최초 1회)

```bash
keytool -genkeypair -v \
  -keystore android.keystore \
  -alias eodigo \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass YOUR_STORE_PASSWORD \
  -keypass YOUR_KEY_PASSWORD \
  -dname "CN=Juchan, OU=Mobile, O=Eodigo, L=Seoul, ST=Seoul, C=KR"
```

생성 후 SHA-256 지문 확인:
```bash
keytool -list -v -keystore android.keystore -alias eodigo
```

**SHA-256 지문을 복사**해서 아래 "assetlinks.json 등록" 단계에서 사용합니다.

---

## 🌐 STEP 2: assetlinks.json 등록 (TWA 핵심)

이 파일이 없으면 앱 상단에 주소창이 뜹니다.

`교통약자어플/.well-known/assetlinks.json` 파일에서
`PLACEHOLDER_SHA256_FINGERPRINT` 부분을 STEP 1에서 복사한 SHA-256 지문으로 교체:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.juchan.eodigo",
    "sha256_cert_fingerprints": [
      "AB:CD:12:34:..."
    ]
  }
}]
```

그리고 `교통약자어플/netlify.toml`에 아래 헤더를 추가:

```toml
[[headers]]
  for = "/.well-known/assetlinks.json"
  [headers.values]
    Content-Type = "application/json"
    Access-Control-Allow-Origin = "*"
```

Netlify에 재배포하면 `https://heartfelt-griffin-2dc6c0.netlify.app/.well-known/assetlinks.json` 로 접근 가능해집니다.

---

## 🏗️ STEP 3: GitHub Actions로 .aab 빌드

Android SDK 없어도 GitHub에서 자동으로 빌드합니다.

### 3-1. GitHub 저장소 생성

```bash
cd eodigo-app
git init
git add .
git commit -m "초기 TWA 앱"
git remote add origin https://github.com/YOUR_ID/eodigo-app.git
git push -u origin main
```

### 3-2. GitHub Secrets 설정

GitHub 저장소 → Settings → Secrets and variables → Actions → New repository secret:

| 이름 | 값 |
|------|-----|
| `KEYSTORE_BASE64` | `base64 android.keystore` 명령 출력값 |
| `KEY_ALIAS` | `eodigo` |
| `KEY_PASSWORD` | 키 비밀번호 |
| `STORE_PASSWORD` | 스토어 비밀번호 |

Base64 변환 (Windows PowerShell):
```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("android.keystore"))
```

### 3-3. 빌드 실행

GitHub → Actions → "Build AAB" → Run workflow

완료되면 `release-aab` Artifact에서 `.aab` 파일 다운로드.

---

## 🖥️ STEP 4: 로컬 빌드 (Android Studio 있는 경우)

1. [Android Studio 다운로드](https://developer.android.com/studio)
2. `key.properties.example` → `key.properties` 복사 후 비밀번호 입력
3. 터미널에서:

```bash
./gradlew bundleRelease
```

결과물: `app/build/outputs/bundle/release/app-release.aab`

---

## 🏪 STEP 5: 플레이스토어 등록 단계별 가이드

### 5-1. Google Play Console 가입
- https://play.google.com/console 접속
- Google 계정으로 로그인
- 개발자 계정 등록 (최초 1회, $25 등록비)

### 5-2. 앱 만들기
1. **"앱 만들기"** 클릭
2. 앱 이름: `어디고?`
3. 기본 언어: `한국어 (ko-KR)`
4. 앱 또는 게임: `앱`
5. 무료 또는 유료: `무료`
6. **"앱 만들기"** 클릭

### 5-3. 앱 설정 완료 (대시보드 체크리스트)

**"앱 콘텐츠"** 탭:
- 개인정보처리방침 URL 입력 (필수)
- 앱 액세스 권한 선택
- 광고 여부: 없음
- 콘텐츠 등급 설문 완료
- 대상 및 콘텐츠 설정

**"앱 정보"** 탭:
- 앱 이름: `어디고?`
- 요약: `말 한마디로 대중교통 길찾기 - 어르신 전용`
- 전체 설명:

```
글을 몰라도, 스마트폰이 서툴러도 괜찮아요.
말 한마디면 어르신 곁에서 길을 찾아드립니다.

✅ 말로 하는 목적지 검색
  "병원 가고 싶어요" 한 마디면 길 찾기 시작

✅ 쉽고 큰 화면
  글씨가 크고, 버튼이 큼직해서 누르기 편해요

✅ 자세한 방향 안내
  "구리역에서 경의중앙선 타세요" 처럼
  어르신이 이해하기 쉽게 단계별 안내

✅ 방향 확인 기능
  "다음 역이 양원역이면 맞게 탄 거예요" 라고
  잘못 탔을 때를 대비한 확인 방법도 알려드려요

✅ 자주 가는 곳 저장
  병원, 복지관 등 자주 가는 곳 저장해두면
  버튼 한 번으로 바로 길 찾기

✅ 긴급 도움 전화
  하단 빨간 버튼으로 1330(교통약자 전용 번호) 바로 연결

* 인터넷 연결이 필요합니다.
* 위치 정보와 마이크 권한이 필요합니다.
```

- 스크린샷 (최소 2장, 휴대폰 기준)
- 아이콘: `icon.svg` → 512×512 PNG 변환해서 업로드
- 특성 그래픽: 1024×500 JPG

### 5-4. 릴리즈 등록

1. **"프로덕션"** → **"새 릴리즈 만들기"**
2. App Bundle(.aab) 업로드
3. 릴리즈명: `1.0.0`
4. 릴리즈 노트:
```
어디고? 첫 출시

글을 몰라도, 말 한마디로 대중교통 길찾기.
어르신을 위한 쉬운 대중교통 안내 앱입니다.
```
5. **"저장"** → **"검토용으로 보내기"**

### 5-5. 심사 및 게시
- Google 심사: 보통 1~7일 소요
- 심사 통과 후 자동 게재

---

## ⚠️ 주의사항

1. **assetlinks.json이 가장 중요합니다.**
   이게 없으면 앱 실행 시 주소창이 뜨고 TWA가 아닌 일반 브라우저처럼 보입니다.

2. **서명 키(.keystore)는 절대 분실하면 안 됩니다.**
   한번 플레이스토어에 등록한 키는 나중에 업데이트할 때도 같은 키여야 합니다.

3. **Play Console 개발자 등록비: $25 (1회)**

---

## 🆘 문제 해결

| 증상 | 원인 | 해결 |
|------|------|------|
| 앱에서 주소창이 뜬다 | assetlinks.json 미등록 | STEP 2 다시 확인 |
| 빌드 실패 (JAVA_HOME) | JDK 미설치 | Android Studio 설치 |
| 앱이 흰 화면만 나온다 | 웹앱 로딩 오류 | 웹 URL 접속 가능한지 확인 |
