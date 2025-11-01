// auth-module.js
export class BiometricAuth {
    constructor() {
        this.stream = null;
        this.onAuthSuccess = null;
        this.onAuthFailure = null;
    }

    // Initialize the authentication modal
    async initialize(containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) throw new Error('Container não encontrado');

        this.onAuthSuccess = options.onSuccess || (() => {});
        this.onAuthFailure = options.onFailure || (() => {});

        // Create modal HTML
        const modalHTML = `
            <div class="login-box" id="biometricAuthModal">
                <h2>Login</h2>
                <button id="biometricBtn" class="biometric-btn">
                    <span class="icon">🔒</span>
                    Login com Biometria
                </button>
                <div id="cameraView" class="camera-container" style="display: none;">
                    <video id="videoElement" autoplay playsinline></video>
                    <button id="cancelBtn" class="cancel-btn">Cancelar</button>
                </div>
            </div>
        `;

        container.innerHTML = modalHTML;

        // Add event listeners
        this.setupEventListeners();

        // Add styles
        this.addStyles();
    }

    // Setup event listeners
    setupEventListeners() {
        const biometricBtn = document.getElementById('biometricBtn');
        const cancelBtn = document.getElementById('cancelBtn');

        // Require a real user gesture (trusted event) to start the camera.
        biometricBtn?.addEventListener('click', (e) => this.startCamera(e));
        cancelBtn?.addEventListener('click', () => this.stopCamera());
        window.addEventListener('beforeunload', () => this.stopCamera());
    }

    // Add required styles
    addStyles() {
        if (!document.getElementById('biometric-auth-styles')) {
            const styleSheet = document.createElement('link');
            styleSheet.id = 'biometric-auth-styles';
            styleSheet.rel = 'stylesheet';
            styleSheet.href = './authentication/biometric-login.css';
            document.head.appendChild(styleSheet);
        }
    }

    // Start camera — requires a trusted user event (prevents programmatic opens)
    async startCamera(evt) {
        // If called without an Event or with an untrusted event, block the action.
        if (!evt || (evt && evt instanceof Event && !evt.isTrusted)) {
            console.warn('startCamera bloqueado: é necessário um gesto do usuário (clique).');
            return;
        }

        const cameraView = document.getElementById('cameraView');
        const videoElement = document.getElementById('videoElement');
        const biometricBtn = document.getElementById('biometricBtn');

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user'
                }
            });
            
            videoElement.srcObject = this.stream;
            cameraView.style.display = 'block';
            biometricBtn.style.display = 'none';
            
        } catch (err) {
            console.error('Erro ao acessar a câmera:', err);
            alert('Não foi possível acessar a câmera. Por favor, verifique se você concedeu as permissões de acesso à câmera.');
            this.onAuthFailure(err);
        }
    }

    // Stop camera
    stopCamera() {
        const cameraView = document.getElementById('cameraView');
        const biometricBtn = document.getElementById('biometricBtn');
        
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            const videoElement = document.getElementById('videoElement');
            if (videoElement) videoElement.srcObject = null;
            if (cameraView) cameraView.style.display = 'none';
            if (biometricBtn) biometricBtn.style.display = 'block';
        }
    }

    // Simulate successful authentication (you would replace this with actual biometric verification)
    simulateAuth() {
        this.onAuthSuccess();
    }
}

export default BiometricAuth;