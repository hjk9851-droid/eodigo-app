# 폰에 직접 설치하는 APK 빌드 방법

## 방법 1: GitHub Actions (권장 - 지금 바로 가능)

### 1단계: GitHub 저장소 만들기

1. https://github.com 접속 → 로그인
2. 오른쪽 상단 **[+]** → **New repository**
3. Repository name: `eodigo-app`
4. Public 선택 → **Create repository** 클릭

### 2단계: 코드 올리기 (PowerShell에서 실행)

```powershell
cd "C:\Users\lkr57\OneDrive\바탕 화면\클로드 코드 대작전\교통약자어플\eodigo-app"

git init
git add .
git commit -m "초기 커밋 - 어디고? TWA 앱"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_ID/eodigo-app.git
git push -u origin main
```

> `YOUR_GITHUB_ID` 부분을 자신의 GitHub 아이디로 바꾸세요

### 3단계: APK 빌드 확인

1. GitHub 저장소 → **Actions** 탭 클릭
2. **"Build APK & AAB"** 워크플로우 실행 중인지 확인
3. 완료까지 약 **5~8분** 대기
4. 완료 후 → 초록 체크 클릭 → **Artifacts** 섹션
5. **eodigo-debug-apk** 클릭해서 ZIP 다운로드
6. ZIP 압축 풀면 `app-debug.apk` 파일 나옴

### 4단계: 안드로이드 폰에 설치

#### 방법 A: 파일로 전송

1. `app-debug.apk` 파일을 폰에 복사 (USB 케이블, 카카오톡 "나에게 보내기" 등)
2. 폰에서 파일 앱으로 APK 파일 찾아서 탭
3. **"알 수 없는 앱 설치 허용"** 설정 → 허용
4. **설치** 버튼 탭
5. 홈 화면에서 **"어디고?"** 앱 확인

#### 방법 B: ADB 직접 설치 (USB 케이블 연결 시)

폰에서 먼저 **USB 디버깅** 활성화:
- 설정 → 휴대폰 정보 → 소프트웨어 정보 → 빌드 번호 **7번** 탭
- 설정 → 개발자 옵션 → USB 디버깅 ON

그다음 PowerShell에서:
```powershell
# adb가 없으면 Platform Tools 다운로드
# https://developer.android.com/studio/releases/platform-tools

adb devices          # 폰 인식 확인
adb install app-debug.apk
```

---

## 방법 2: Android Studio 로컬 빌드

### 설치 (최초 1회, 약 4GB)

```powershell
winget install Google.AndroidStudio
```

또는 https://developer.android.com/studio 에서 직접 다운로드

### 빌드

1. Android Studio 실행
2. **Open** → `eodigo-app` 폴더 선택
3. 상단 메뉴 **Build** → **Build APK(s)**
4. 완료 후 우하단 팝업에서 **locate** 클릭
5. `app/build/outputs/apk/debug/app-debug.apk` 파일 생성됨

---

## 알 수 없는 앱 설치 허용 방법 (갤럭시 기준)

1. 설정 → **앱** → 우상단 ⁝ → **특별한 앱 접근 권한**
2. **알 수 없는 앱 설치**
3. 파일 앱(또는 카카오톡 등) 선택 → **허용**

---

## 주의사항

- 디버그 APK는 테스트용이라 앱 실행 속도가 약간 느릴 수 있어요
- TWA이라 Chrome 또는 WebView 브라우저가 필요해요 (보통 기본 설치됨)
- assetlinks.json이 없으면 앱 상단에 주소창이 보일 수 있어요 (기능은 정상 작동)
