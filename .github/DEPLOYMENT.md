# CI/CD 배포 가이드

## 아키텍처 개요

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   GitHub        │      │    Jenkins      │      │   Production    │
│   (CI)          │ ───▶ │    (CD)         │ ───▶ │   Server        │
│                 │      │                 │      │                 │
│ - Type Check    │      │ - Checkout      │      │ - Docker        │
│ - Lint          │      │ - Build Image   │      │ - Caddy         │
│ - Build         │      │ - Deploy        │      │ - App           │
│ - Trigger CD    │      │ - Health Check  │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## GitHub Actions (CI)

### 트리거 조건

- `main`, `develop` 브랜치에 push
- `main`, `develop` 브랜치로의 Pull Request

### CI 파이프라인 단계

1. **Checkout**: 코드 체크아웃
2. **Setup Node.js**: Node.js 20 설정 및 npm 캐시
3. **Install**: `npm ci`로 의존성 설치
4. **Type Check**: TypeScript 타입 검사
5. **Lint**: ESLint 검사
6. **Build**: Next.js 빌드
7. **Trigger Jenkins**: (main 브랜치 push 시만) Jenkins 배포 트리거

## GitHub Secrets 설정

Repository Settings > Secrets and variables > Actions에서 다음 시크릿을 설정:

| Secret Name | 설명 | 예시 |
|-------------|------|------|
| `JENKINS_URL` | Jenkins 서버 URL | `https://jenkins.example.com` |
| `JENKINS_JOB_NAME` | Jenkins Job 이름 | `commu-deploy` |
| `JENKINS_API_TOKEN` | Jenkins API 토큰 | `11xxxxxxxxxxxxxx` |
| `JENKINS_BUILD_TOKEN` | Jenkins Build Token | `your-build-token` |

### Jenkins API Token 생성 방법

1. Jenkins 로그인
2. 사용자명 클릭 > Configure
3. API Token > Add new Token
4. 생성된 토큰 복사

### Jenkins Build Token 설정 방법

1. Jenkins Job 설정
2. Build Triggers > Trigger builds remotely
3. Authentication Token 설정

## Jenkins (CD)

### 필수 플러그인

- Docker Pipeline
- Git Plugin
- Pipeline
- Workspace Cleanup

### Jenkins Job 설정

1. **새 Item** > Pipeline 선택
2. **Pipeline from SCM** 설정:
   - SCM: Git
   - Repository URL: `https://github.com/shaul1991/commu.git`
   - Branch: `*/main`
   - Script Path: `Jenkinsfile`

### Jenkins 파이프라인 단계

1. **Prepare**: 빌드 정보 설정
2. **Checkout**: Git에서 코드 체크아웃
3. **Build Docker Image**: Docker 이미지 빌드
4. **Pre-deploy Health Check**: 현재 상태 확인
5. **Deploy**: 컨테이너 교체 배포
6. **Post-deploy Health Check**: 배포 후 상태 확인
7. **Cleanup**: 불필요한 이미지 정리

### 롤백

배포 실패 시 자동으로 이전 커밋으로 롤백을 시도합니다.

수동 롤백:
```bash
cd /opt/projects/commu
git checkout HEAD~1
docker compose down
docker compose build
docker compose up -d
```

## 서버 환경

### 필수 요구사항

- Docker & Docker Compose
- Git
- 포트 3200 오픈

### 디렉토리 구조

```
/opt/projects/commu/
├── .github/
│   └── workflows/
│       └── ci.yml
├── Jenkinsfile
├── docker-compose.yml
├── Dockerfile
└── src/
```

## 문제 해결

### CI 실패

1. **Type Check 실패**: TypeScript 오류 확인
   ```bash
   npm run type-check
   ```

2. **Lint 실패**: ESLint 오류 확인
   ```bash
   npm run lint
   npm run lint:fix  # 자동 수정
   ```

3. **Build 실패**: 빌드 로그 확인
   ```bash
   npm run build
   ```

### Jenkins 연동 실패

1. **401 Unauthorized**: API Token 확인
2. **404 Not Found**: Job 이름 확인
3. **Connection refused**: Jenkins URL 및 방화벽 확인

### 배포 실패

1. **컨테이너 시작 실패**:
   ```bash
   docker logs commu --tail 100
   ```

2. **헬스체크 실패**:
   ```bash
   curl -v http://localhost:3200
   ```

3. **포트 충돌**:
   ```bash
   netstat -tlnp | grep 3200
   ```

## 모니터링

### 컨테이너 상태 확인
```bash
docker ps -f name=commu
docker stats commu
```

### 로그 확인
```bash
docker logs -f commu --tail 100
```

### 리소스 사용량
```bash
docker system df
```
