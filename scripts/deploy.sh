#!/bin/bash
set -e

# 환경 변수 설정
ENV=${1:-dev}
PROJECT_DIR="/opt/projects/commu"
PM2_NAME="commu-${ENV}"

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_info "Starting deployment for ${ENV} environment..."
log_info "Project directory: ${PROJECT_DIR}"

# 프로젝트 디렉토리로 이동
cd "${PROJECT_DIR}"

# 의존성 설치
log_info "Installing dependencies..."
npm ci

# 빌드
log_info "Building application..."
npm run build

# PM2로 배포
log_info "Deploying with PM2..."
if pm2 describe "${PM2_NAME}" > /dev/null 2>&1; then
    log_info "Restarting existing PM2 process: ${PM2_NAME}"
    pm2 restart "${PM2_NAME}"
else
    log_info "Starting new PM2 process: ${PM2_NAME}"
    pm2 start npm --name "${PM2_NAME}" -- start
fi

# PM2 설정 저장
pm2 save

# 프로세스 상태 확인
log_info "Checking process status..."
pm2 status "${PM2_NAME}"

log_info "Deployment completed successfully!"
