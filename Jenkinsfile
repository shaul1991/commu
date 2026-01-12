pipeline {
    agent any

    environment {
        // 프로젝트 설정
        PROJECT_NAME = 'commu'
        DEPLOY_PATH = '/opt/projects/commu'

        // Docker 설정
        DOCKER_IMAGE = 'commu-app'
        DOCKER_CONTAINER = 'commu'

        // 알림 설정 (선택사항)
        SLACK_CHANNEL = '#deployments'
    }

    parameters {
        string(name: 'GIT_COMMIT', defaultValue: '', description: 'Git commit SHA')
        string(name: 'GIT_BRANCH', defaultValue: 'main', description: 'Git branch name')
    }

    options {
        // 빌드 타임아웃 설정
        timeout(time: 30, unit: 'MINUTES')
        // 빌드 기록 유지
        buildDiscarder(logRotator(numToKeepStr: '10'))
        // 동시 빌드 방지
        disableConcurrentBuilds()
    }

    stages {
        // =====================
        // Stage 1: 준비
        // =====================
        stage('Prepare') {
            steps {
                script {
                    currentBuild.displayName = "#${BUILD_NUMBER} - ${params.GIT_BRANCH}"
                    currentBuild.description = "Commit: ${params.GIT_COMMIT?.take(7) ?: 'latest'}"
                }

                echo "=========================================="
                echo "프로젝트: ${PROJECT_NAME}"
                echo "브랜치: ${params.GIT_BRANCH}"
                echo "커밋: ${params.GIT_COMMIT}"
                echo "=========================================="
            }
        }

        // =====================
        // Stage 2: 코드 체크아웃
        // =====================
        stage('Checkout') {
            steps {
                dir("${DEPLOY_PATH}") {
                    sh """
                        echo "Configuring git safe directory..."
                        git config --global --add safe.directory /opt/projects/commu

                        echo "Setting remote URL to HTTPS..."
                        git remote set-url origin https://github.com/shaul1991/commu.git

                        echo "Fetching latest code..."
                        git fetch origin

                        echo "Resetting local changes..."
                        git reset --hard HEAD
                        git clean -fd

                        echo "Checking out branch: ${params.GIT_BRANCH}"
                        git checkout ${params.GIT_BRANCH} 2>/dev/null || git checkout -b ${params.GIT_BRANCH} origin/${params.GIT_BRANCH}
                        git reset --hard origin/${params.GIT_BRANCH}

                        COMMIT_PARAM="${params.GIT_COMMIT}"
                        if [ -n "\$COMMIT_PARAM" ]; then
                            echo "Checking out specific commit: \$COMMIT_PARAM"
                            git checkout \$COMMIT_PARAM
                        fi

                        echo "Current commit:"
                        git log -1 --oneline
                    """
                }
            }
        }

        // =====================
        // Stage 3: Docker 빌드
        // =====================
        stage('Build Docker Image') {
            steps {
                dir("${DEPLOY_PATH}") {
                    sh '''
                        echo "Building Docker image..."

                        # Docker Compose로 빌드
                        docker compose build --no-cache

                        echo "Docker image built successfully"
                    '''
                }
            }
        }

        // =====================
        // Stage 4: 헬스체크 준비
        // =====================
        stage('Pre-deploy Health Check') {
            steps {
                sh '''
                    echo "Checking current deployment status..."

                    # 현재 컨테이너 상태 확인
                    if docker ps -q -f name=${DOCKER_CONTAINER} | grep -q .; then
                        echo "Current container is running"
                        docker ps -f name=${DOCKER_CONTAINER}
                    else
                        echo "No running container found"
                    fi
                '''
            }
        }

        // =====================
        // Stage 5: 배포
        // =====================
        stage('Deploy') {
            steps {
                dir("${DEPLOY_PATH}") {
                    sh '''
                        echo "Deploying new version..."

                        # 기존 컨테이너 중지 및 제거
                        docker compose down --remove-orphans || true

                        # 새 컨테이너 시작
                        docker compose up -d

                        # 컨테이너 시작 대기 (Next.js 앱 준비 시간 필요)
                        echo "Waiting for container to start..."
                        sleep 20

                        echo "Deployment completed"
                    '''
                }
            }
        }

        // =====================
        // Stage 6: 배포 후 헬스체크
        // =====================
        stage('Post-deploy Health Check') {
            steps {
                sh '''
                    echo "Waiting for application to start..."
                    sleep 15

                    # 네트워크 진단 정보
                    echo "=== Network diagnostics ==="
                    echo "Checking if port 3200 is listening..."
                    netstat -tlnp | grep 3200 || ss -tlnp | grep 3200 || echo "Port check command not available"
                    echo "Container network info:"
                    docker inspect commu --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' || true
                    echo "==========================="

                    for i in 1 2 3 4 5; do
                        echo "Health check attempt $i..."

                        # 컨테이너 상태 확인
                        if ! docker ps -q -f name=commu | grep -q .; then
                            echo "ERROR: Container is not running!"
                            docker logs commu --tail 50
                            exit 1
                        fi

                        # HTTP 헬스체크 - verbose mode for debugging
                        echo "Attempting curl to localhost:3200..."
                        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 --max-time 15 http://localhost:3200 2>&1) || true
                        echo "HTTP response code: $HTTP_CODE"

                        if [ "$HTTP_CODE" = "200" ]; then
                            echo "Health check passed!"
                            exit 0
                        fi

                        # 실패 시 상세 정보 출력
                        echo "Curl verbose output:"
                        curl -v --connect-timeout 5 http://localhost:3200 2>&1 | head -30 || true

                        echo "Attempt $i failed, retrying..."
                        sleep 5
                    done

                    echo "Health check failed after 5 attempts"
                    docker logs commu --tail 50
                    exit 1
                '''
            }
        }

        // =====================
        // Stage 7: 정리
        // =====================
        stage('Cleanup') {
            steps {
                sh '''
                    echo "Cleaning up old Docker images..."

                    # 사용하지 않는 이미지 정리
                    docker image prune -f --filter "until=24h" || true

                    # dangling 이미지 정리
                    docker images -f "dangling=true" -q | xargs -r docker rmi || true

                    echo "Cleanup completed"
                '''
            }
        }
    }

    post {
        success {
            echo "=========================================="
            echo "배포 성공!"
            echo "URL: https://commu.shaul.link"
            echo "=========================================="
        }

        failure {
            echo "=========================================="
            echo "배포 실패!"
            echo "=========================================="

            // 롤백 시도 (선택사항)
            sh '''
                echo "Attempting rollback..."
                cd ${DEPLOY_PATH}
                git config --global --add safe.directory /opt/projects/commu

                # 이전 이미지로 롤백 시도
                docker compose down || true
                git checkout HEAD~1 || true
                docker compose up -d || true
            '''
        }

        always {
            // 빌드 결과 기록
            script {
                def duration = currentBuild.durationString.replace(' and counting', '')
                echo "빌드 소요 시간: ${duration}"
            }

            // Jenkins 워크스페이스 정리 (deleteDir 사용)
            deleteDir()
        }
    }
}
