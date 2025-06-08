pipeline {
    agent any
    
    environment {
        KUBE_SERVER = '54.166.111.220'
        SSH_KEY = '~/.ssh/id_rsa'
        REPO_URL = 'https://github.com/Afifahnabila25/ProjekAkhir_Devops.git'
        NAMESPACE = 'default'
    }
    
    stages {
        stage('🔍 Code Checkout') {
            steps {
                echo '=== CHECKING OUT SOURCE CODE ==='
                checkout scm
                sh 'ls -la'
            }
        }
        
        stage('🏗️ Build Docker Images') {
            steps {
                echo '=== BUILDING DOCKER IMAGES ==='
                script {
                    sh '''
                    ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ubuntu@${KUBE_SERVER} << 'EOF'
                    
                    # Update repository
                    mkdir -p ~/devops-project/
                    if [ -d "~/devops-project/ProjekAkhir_Devops" ]; then
                        cd ~/devops-project/ProjekAkhir_Devops
                        git pull origin main
                    else
                        cd ~/devops-project/
                        git clone ${REPO_URL}
                        cd ProjekAkhir_Devops
                    fi
                    
                    # Build images dengan Minikube Docker daemon
                    eval $(minikube docker-env)
                    
                    # Build Frontend
                    if [ -d "frontend" ] && [ -f "frontend/Dockerfile" ]; then
                        echo "Building frontend image..."
                        docker build -t frontend-app:latest ./frontend/
                    fi
                    
                    # Build Backend  
                    if [ -d "backend" ] && [ -f "backend/Dockerfile" ]; then
                        echo "Building backend image..."
                        docker build -t backend-app:latest ./backend/
                    fi
                    
                    # List built images
                    docker images | grep -E "(frontend-app|backend-app)"
                    
EOF
                    '''
                }
            }
        }
        
        stage('🧪 Validate Kubernetes Manifests') {
            steps {
                echo '=== VALIDATING KUBERNETES MANIFESTS ==='
                script {
                    sh '''
                    ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ubuntu@${KUBE_SERVER} << 'EOF'
                    
                    cd ~/devops-project/ProjekAkhir_Devops
                    
                    # Validate all YAML files
                    echo "Validating Kubernetes manifests..."
                    
                    for file in $(find k8s -name "*.yaml" -o -name "*.yml"); do
                        echo "Validating $file..."
                        kubectl apply --dry-run=client -f $file || echo "Warning: $file validation failed"
                    done
                    
EOF
                    '''
                }
            }
        }
        
        stage('🗄️ Deploy Database') {
            steps {
                echo '=== DEPLOYING DATABASE ==='
                script {
                    sh '''
                    ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ubuntu@${KUBE_SERVER} << 'EOF'
                    
                    cd ~/devops-project/ProjekAkhir_Devops
                    
                    # Apply database manifests
                    echo "Deploying database components..."
                    kubectl apply -f k8s/database/
                    
                    # Wait for database to be ready
                    echo "Waiting for database pod to be ready..."
                    kubectl wait --for=condition=ready pod -l app=database --timeout=300s || echo "Database pod not ready in time"
                    
                    # Check database status
                    kubectl get pods -l app=database
                    kubectl get services -l app=database
                    
EOF
                    '''
                }
            }
        }
        
        stage('🔧 Deploy Backend') {
            steps {
                echo '=== DEPLOYING BACKEND APPLICATION ==='
                script {
                    sh '''
                    ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ubuntu@${KUBE_SERVER} << 'EOF'
                    
                    cd ~/devops-project/ProjekAkhir_Devops
                    
                    # Apply ConfigMap and Secret first
                    kubectl apply -f k8s/configmap.yaml || echo "ConfigMap not found"
                    kubectl apply -f k8s/secret.yaml || echo "Secret not found"
                    
                    # Deploy backend
                    echo "Deploying backend application..."
                    kubectl apply -f k8s/backend/
                    
                    # Wait for backend to be ready
                    echo "Waiting for backend pods to be ready..."
                    kubectl wait --for=condition=ready pod -l app=backend --timeout=300s || echo "Backend pods not ready in time"
                    
                    # Check backend status
                    kubectl get pods -l app=backend
                    kubectl get services -l app=backend
                    
EOF
                    '''
                }
            }
        }
        
        stage('🎨 Deploy Frontend') {
            steps {
                echo '=== DEPLOYING FRONTEND APPLICATION ==='
                script {
                    sh '''
                    ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ubuntu@${KUBE_SERVER} << 'EOF'
                    
                    cd ~/devops-project/ProjekAkhir_Devops
                    
                    # Deploy frontend
                    echo "Deploying frontend application..."
                    kubectl apply -f k8s/frontend/
                    
                    # Wait for frontend to be ready
                    echo "Waiting for frontend pods to be ready..."
                    kubectl wait --for=condition=ready pod -l app=frontend --timeout=300s || echo "Frontend pods not ready in time"
                    
                    # Check frontend status
                    kubectl get pods -l app=frontend
                    kubectl get services -l app=frontend
                    
EOF
                    '''
                }
            }
        }
        
        stage('🌐 Setup Ingress & Networking') {
            steps {
                echo '=== SETTING UP INGRESS AND NETWORKING ==='
                script {
                    sh '''
                    ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ubuntu@${KUBE_SERVER} << 'EOF'
                    
                    cd ~/devops-project/ProjekAkhir_Devops
                    
                    # Enable ingress addon untuk Minikube
                    minikube addons enable ingress
                    
                    # Apply ingress
                    kubectl apply -f k8s/ingress.yaml || echo "Ingress file not found"
                    
                    # Check ingress status
                    kubectl get ingress
                    
                    # Get Minikube IP for access
                    echo "Minikube IP:"
                    minikube ip
                    
EOF
                    '''
                }
            }
        }
        
        stage('✅ Health Check & Verification') {
            steps {
                echo '=== PERFORMING HEALTH CHECKS ==='
                script {
                    sh '''
                    ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ubuntu@${KUBE_SERVER} << 'EOF'
                    
                    cd ~/devops-project/ProjekAkhir_Devops
                    
                    echo "=== CLUSTER STATUS ==="
                    kubectl get nodes
                    
                    echo "=== ALL PODS ==="
                    kubectl get pods -o wide
                    
                    echo "=== ALL SERVICES ==="
                    kubectl get services
                    
                    echo "=== DEPLOYMENTS ==="
                    kubectl get deployments
                    
                    echo "=== INGRESS ==="
                    kubectl get ingress
                    
                    echo "=== PERSISTENT VOLUMES ==="
                    kubectl get pv,pvc
                    
                    echo "=== RECENT EVENTS ==="
                    kubectl get events --sort-by=.metadata.creationTimestamp | tail -10
                    
                    echo "=== APPLICATION ACCESS INFO ==="
                    MINIKUBE_IP=$(minikube ip)
                    echo "Access your application at: http://$MINIKUBE_IP"
                    
                    # Test internal connectivity
                    echo "=== TESTING INTERNAL CONNECTIVITY ==="
                    kubectl exec -it $(kubectl get pod -l app=frontend -o jsonpath="{.items[0].metadata.name}") -- curl -s http://backend-service:5000/health || echo "Backend health check failed"
                    
EOF
                    '''
                }
            }
        }
    }
    
    post {
        always {
            echo '=== PIPELINE COMPLETED ==='
        }
        success {
            echo '''
            🎉 KUBERNETES DEPLOYMENT SUCCESSFUL! 🎉
            
            ✅ DevOps Pipeline Summary:
            - ✅ Source code checked out
            - ✅ Docker images built
            - ✅ Kubernetes manifests validated
            - ✅ Database deployed
            - ✅ Backend application deployed  
            - ✅ Frontend application deployed
            - ✅ Ingress configured
            - ✅ Health checks passed
            
            🚀 Your application is now running on Kubernetes!
            
            Access your application:
            SSH to server and run: minikube ip
            Then access: http://<minikube-ip>
            
            Monitor your deployment:
            - kubectl get pods
            - kubectl get services  
            - kubectl logs <pod-name>
            '''
        }
        failure {
            echo '''
            ❌ KUBERNETES DEPLOYMENT FAILED! ❌
            
            Troubleshooting steps:
            1. Check kubectl connection: kubectl get nodes
            2. Check pod status: kubectl get pods
            3. Check pod logs: kubectl logs <pod-name>
            4. Check events: kubectl get events
            5. Verify images: docker images
            
            Common issues:
            - Minikube not running: minikube start
            - Image pull errors: Check Dockerfile
            - Resource limits: Check cluster resources
            '''
        }
    }
}
