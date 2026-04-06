import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let currentModel = null;
let headBone = null; // 머리 움직임을 제어할 뼈대 객체
let mouse = new THREE.Vector2();
let targetRotation = new THREE.Vector2();

// 리액션 애니메이션용 상태 변수
let isReacting = false;
let reactionStartTime = 0;

const loader = new GLTFLoader();

// Model paths
const models = {
    king: 'models/sejong.glb',
    hip: 'models/sejong.glb' // 사용자가 hip_sejong을 넣기 전까지 동일 모델로 연결해둠
};

init();
animate();

function init() {
    const container = document.getElementById('three-container');
    if (!container) return;

    // 1. Scene
    scene = new THREE.Scene();
    
    // 2. Camera
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 1.5, 4);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Set clear color to transparent so our UI background shows through
    renderer.setClearColor(0x000000, 0); 
    container.appendChild(renderer.domElement);

    // 4. Lights - 빨간 곤룡포와 금색 용 문양을 강조하는 조명 셋업
    // 전반적으로 밝고 부드러운 주변광
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // 입체감을 살리는 주 조명 (따뜻한 톤)
    const dirLight = new THREE.DirectionalLight(0xfff5e6, 2.5);
    dirLight.position.set(2, 6, 4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // 반대편에서 은은하게 붉은/금색 톤을 살려주는 보조 빛 (반사광 연출)
    const fillLight = new THREE.DirectionalLight(0xffedd5, 1.0);
    fillLight.position.set(-3, 3, -3);
    scene.add(fillLight);

    // 5. Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1, 0); // focus on center of character
    controls.minDistance = 2;
    controls.maxDistance = 6;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // disallow looking from strictly underneath

    // 6. Event Listeners
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('changeWorldModel', (e) => {
        loadModel(models[e.detail]);
    });
    window.addEventListener('characterReact', () => {
        isReacting = true;
        reactionStartTime = Date.now();
    });

    // 마우스 추적 이벤트 (인터랙션)
    const bounds = container.getBoundingClientRect();
    container.addEventListener('mousemove', (e) => {
        // -1 에서 1 사이의 값으로 정규화 (캔버스 내부 기준)
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        mouse.x = (x / rect.width) * 2 - 1;
        mouse.y = -(y / rect.height) * 2 + 1;
        
        // 회전 한계값 설정 (좌우 상하)
        targetRotation.x = mouse.x * (Math.PI / 4); // 좌우 최대 45도
        targetRotation.y = mouse.y * (Math.PI / 6); // 상하 최대 30도
    });
    
    // 마우스가 영역을 벗어나면 정면을 바라보도록 복귀
    container.addEventListener('mouseleave', () => {
        targetRotation.x = 0;
        targetRotation.y = 0;
    });

    // 7. Initial Load
    loadModel(models.king);
}

function loadModel(path) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.opacity = '1';

    // Remove existing model if any
    if (currentModel) {
        scene.remove(currentModel);
        currentModel.traverse((child) => {
            if (child.isMesh) {
                child.geometry.dispose();
                if (child.material.isMaterial) {
                    child.material.dispose();
                } else if (Array.isArray(child.material)) {
                    child.material.forEach(mat => mat.dispose());
                }
            }
        });
        currentModel = null;
        headBone = null;
    }

    loader.load(
        path,
        (gltf) => {
            currentModel = gltf.scene;
            
            // Setup shadows and find Head bone for animation
            currentModel.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
                
                // 캐릭터의 목(Neck)이나 머리(Head) 뼈대(Bone)를 찾아서 할당
                if (child.isBone && (child.name.toLowerCase().includes('head') || child.name.toLowerCase().includes('neck'))) {
                    // 첫 번째로 발견된 머리 관련 뼈대를 타겟으로 지정
                    if (!headBone) headBone = child;
                }
            });

            // Adjust position if necessary depending on the exported model's origin
            // currentModel.position.y = -1;

            scene.add(currentModel);

            // Hide loading overlay
            if (overlay) {
                setTimeout(() => {
                    overlay.style.opacity = '0';
                    setTimeout(() => overlay.style.pointerEvents = 'none', 300);
                }, 500);
            }
        },
        (xhr) => {
            // Optional: calculate progress
            // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
            console.error('An error happened while loading the 3D model:', error);
            // Hide loading overlay on error as well so UI isn't blocked forever
            if (overlay) {
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
            }
        }
    );
}

function onWindowResize() {
    const container = document.getElementById('three-container');
    if (!container || !camera || !renderer) return;

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    // 애니메이션 시간 기반 연산
    const time = Date.now() * 0.002;
    let targetYOffset = 0;
    let headNod = 0;

    // 1. 대답 리액션 (질문 입력 시 기분 좋게 움직임)
    if (isReacting) {
        const elapsed = Date.now() - reactionStartTime;
        if (elapsed < 800) { // 0.8초 동안 반응
            // 통통 튀는 들썩임 (절댓값을 씌워 통통 튀도록)
            targetYOffset = Math.abs(Math.sin(elapsed * 0.015)) * 0.06;
            // 고개도 귀엽게 끄덕이는 효과
            headNod = Math.sin(elapsed * 0.015) * 0.15;
        } else {
            isReacting = false;
        }
    } else {
        // 2. 평상시 상태 (Idle)
        // 사용자의 요청으로 둥둥 떠다니는 모션을 끄고 가만히 있도록 수정
        targetYOffset = 0;
    }

    if (currentModel) {
        // 스무스하게 위치 적용
        currentModel.position.y += (targetYOffset - currentModel.position.y) * 0.2;
    }
    
    // 캐릭터 머리 추적 트위닝 (Lerp)
    if (headBone) {
        // 부드러운 움직임을 위한 보간 연산 (현재 각도에서 타겟 각도로 5%씩 이동)
        headBone.rotation.y += (targetRotation.x - headBone.rotation.y) * 0.05;
        headBone.rotation.x += (-targetRotation.y - headBone.rotation.x + headNod) * 0.05;
    } else if (currentModel) {
        // 만약 모델에 특수 뼈대 스켈레톤이 없다면, 몸통 전제를 부드럽게 회전
        currentModel.rotation.y += (targetRotation.x - currentModel.rotation.y) * 0.05;
    }

    if (controls) controls.update();
    if (renderer && scene && camera) renderer.render(scene, camera);
}
