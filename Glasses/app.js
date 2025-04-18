let scene, camera, renderer, controls;
let glasses, mixer;
let currentModel = 'classic';
let frameColor = '#000000';
let lensColor = '#90CDF4';
let isRotating = false;
let isWireframe = false;
let loadingManager, gltfLoader, objLoader, mtlLoader;
let clock = new THREE.Clock();

function init() {
    loadingManager = new THREE.LoadingManager();
    loadingManager.onStart = function() {
        document.getElementById('loading-indicator').classList.add('visible');
    };
    loadingManager.onLoad = function() {
        document.getElementById('loading-indicator').classList.remove('visible');
    };
    loadingManager.onError = function(url) {
        console.error('حدث خطأ أثناء تحميل: ' + url);
        document.getElementById('loading-indicator').classList.remove('visible');
    };

    gltfLoader = new THREE.GLTFLoader(loadingManager);
    objLoader = new THREE.OBJLoader(loadingManager);
    mtlLoader = new THREE.MTLLoader(loadingManager);
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);
    
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / (window.innerHeight * 0.7), 0.1, 1000);
    camera.position.z = 5;
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(document.getElementById('canvas-container').offsetWidth, document.getElementById('canvas-container').offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.7;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.enablePan = false;
    
    loadModel(currentModel);
    
    setupEventListeners();
    
    animate();
}

function loadModel(modelType) {
    if (glasses) {
        scene.remove(glasses);
        glasses = null;
    }

    glasses = new THREE.Group();
    scene.add(glasses);
    
    let modelPath = 'scene.gltf';
    
    switch(modelType) {
        case 'sport':
            modelPath = './scene.gltf';
            break;
        case 'vintage':
            modelPath = './scene.gltf';
            break;
        case 'modern':
            modelPath = './scene.gltf';
            break;
        case 'classic':
        default:
            modelPath = './scene.gltf';
            break;
    }           

    // التحميل باستخدام GLTF
    const gltfPath = modelPath + '.gltf';
    gltfLoader.load(
        gltfPath,
        function(gltf) {
            handleLoadedModel(gltf.scene);
        },
        undefined,
        function(error) {
            console.log('فشل تحميل GLTF، جاري المحاولة بتنسيق OBJ');
            
            // محاولة تحميل OBJ إذا فشل GLTF
            const mtlPath = modelPath + '.mtl';
            const objPath = modelPath + '.obj';
            
            mtlLoader.load(
                mtlPath,
                function(materials) {
                    materials.preload();
                    objLoader.setMaterials(materials);
                    objLoader.load(
                        objPath,
                        function(object) {
                            handleLoadedModel(object);
                        },
                        undefined,
                        function(error) {
                            console.error('فشل تحميل النموذج:', error);
                            // إنشاء نموذج بسيط كبديل
                            createFallbackModel();
                        }
                    );
                },
                undefined,
                function(error) {
                    console.log('فشل تحميل MTL، جاري تحميل OBJ مباشرة');
                    objLoader.load(
                        objPath,
                        function(object) {
                            handleLoadedModel(object);
                        },
                        undefined,
                        function(error) {
                            console.error('فشل تحميل النموذج:', error);
                            // إنشاء نموذج بسيط كبديل
                            createFallbackModel();
                        }
                    );
                }
            );
        }
    );
}

// ---------- معالجة النموذج بعد التحميل ----------
function handleLoadedModel(model) {
    // إضافة النموذج إلى المجموعة
    glasses.add(model);
    
    // ضبط الحجم والموضع
    model.scale.set(1, 1, 1); // قد تحتاج لتعديل هذا حسب حجم النموذج
    model.position.set(0, 0, 0);
    
    // تطبيق الألوان المحددة
    applyMaterials(model);
    
    // إعادة ضبط العرض
    resetView();
}

function createFallbackModel() {
    // إنشاء إطار النظارة (الشكل الأساسي)
    const frameGeom = new THREE.TorusGeometry(1, 0.1, 16, 100, Math.PI);
    const frameMat = new THREE.MeshPhongMaterial({ color: frameColor });
    
    const leftFrame = new THREE.Mesh(frameGeom, frameMat);
    leftFrame.rotation.x = Math.PI/2;
    leftFrame.position.set(-1.2, 0, 0);
    glasses.add(leftFrame);
    
    const rightFrame = new THREE.Mesh(frameGeom, frameMat);
    rightFrame.rotation.x = Math.PI/2;
    rightFrame.position.set(1.2, 0, 0);
    glasses.add(rightFrame);
    
    // إنشاء العدسات
    const lensGeom = new THREE.CircleGeometry(0.9, 32);
    const lensMat = new THREE.MeshPhongMaterial({
        color: lensColor,
        transparent: true,
        opacity: 0.6
    });
    
    const leftLens = new THREE.Mesh(lensGeom, lensMat);
    leftLens.rotation.x = -Math.PI/2;
    leftLens.position.set(-1.2, 0, 0.05);
    glasses.add(leftLens);
    
    const rightLens = new THREE.Mesh(lensGeom, lensMat);
    rightLens.rotation.x = -Math.PI/2;
    rightLens.position.set(1.2, 0, 0.05);
    glasses.add(rightLens);
    
    // إنشاء الجسر
    const bridgeGeom = new THREE.CylinderGeometry(0.05, 0.05, 2.4, 8);
    const bridge = new THREE.Mesh(bridgeGeom, frameMat);
    bridge.rotation.z = Math.PI/2;
    bridge.position.set(0, 0, 0);
    glasses.add(bridge);
    
    // إنشاء الذراعين
    const armGeom = new THREE.BoxGeometry(1.5, 0.1, 0.05);
    
    const leftArm = new THREE.Mesh(armGeom, frameMat);
    leftArm.position.set(-2, 0, -0.5);
    leftArm.rotation.y = Math.PI/4;
    glasses.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeom, frameMat);
    rightArm.position.set(2, 0, -0.5);
    rightArm.rotation.y = -Math.PI/4;
    glasses.add(rightArm);
    
    // إعادة ضبط العرض
    resetView();
}


function applyMaterials(model) {
    model.traverse(function(child) {
        if (child.isMesh) {
            // تشغيل خاصية الظلال
            child.castShadow = true;
            child.receiveShadow = true;
            
            // حفظ المادة الأصلية
            if (!child.userData.originalMaterial) {
                child.userData.originalMaterial = child.material.clone();
            }
            
            // تطبيق خاصية الإطار السلكي
            if (isWireframe) {
                child.material.wireframe = true;
            }
            
            // تطبيق الألوان حسب اسم العنصر أو الشبكة
            // ملاحظة: قد تحتاج لتعديل هذا حسب هيكل نموذجك
            const name = child.name.toLowerCase();
            
            if (name.includes('frame') || name.includes('rim') || name.includes('temple') || 
                name.includes('arm') || name.includes('bridge')) {
                // مكونات الإطار
                child.material.color.set(frameColor);
            } 
            else if (name.includes('lens') || name.includes('glass')) {
                // مكونات العدسات
                child.material.color.set(lensColor);
                child.material.transparent = true;
                child.material.opacity = 0.7;
            }
            // يمكن إضافة شروط أخرى حسب هيكل النموذج
        }
    });
}


function resetView() {
    if (glasses) {
        
        glasses.rotation.set(0, 0, 0);

        const box = new THREE.Box3().setFromObject(glasses);
        const boxSize = box.getSize(new THREE.Vector3()).length();
        
        
        controls.reset();
    }
}

function toggleRotation() {
    isRotating = !isRotating;
    
    if (isRotating) {
        document.getElementById('toggle-rotation-btn').textContent = '⟳';
    } else {
        document.getElementById('toggle-rotation-btn').textContent = '⊝';
    }
    const rotationBtn = document.getElementById('toggle-rotation-btn');
    rotationBtn.textContent = isRotating ? '⊝' : '⟳';
}

function toggleWireframe() {
    isWireframe = !isWireframe;
    
    
    if (glasses) {
        glasses.traverse(function(child) {
            if (child.isMesh) {
                child.material.wireframe = isWireframe;
            }
        });
    }
}


function selectModel(modelType) {
    currentModel = modelType;
    

    document.querySelectorAll('.model-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`.model-card[data-model="${modelType}"]`).classList.add('selected');
    
    loadModel(modelType);
}

function changeFrameColor(color) {
    frameColor = color;
    
    
    document.querySelectorAll('#frame-colors .color-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector(`#frame-colors .color-option[data-color="${color}"]`).classList.add('selected');
    
    
    if (glasses) {
        glasses.traverse(function(child) {
            if (child.isMesh) {
                const name = child.name.toLowerCase();
                if (name.includes('frame') || name.includes('rim') || name.includes('temple') || 
                    name.includes('arm') || name.includes('bridge') || 
                    (!name.includes('lens') && !name.includes('glass'))) {
                    child.material.color.set(color);
                }
            }
        });
    }
}

function changeLensColor(color) {
    lensColor = color;
    
    document.querySelectorAll('#lens-colors .color-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector(`#lens-colors .color-option[data-color="${color}"]`).classList.add('selected');
    
    
    if (glasses) {
        glasses.traverse(function(child) {
            if (child.isMesh) {
                const name = child.name.toLowerCase();
                if (name.includes('lens') || name.includes('glass')) {
                    child.material.color.set(color);
                }
            }
        });
    }
}


function saveDesign() {
    
    const design = {
        model: currentModel,
        frameColor: frameColor,
        lensColor: lensColor
    };
    
    localStorage.setItem('savedGlassesDesign', JSON.stringify(design));
    alert('تم حفظ التصميم بنجاح!');
}

function shareDesign() {
    
    const shareUrl = `${window.location.origin}${window.location.pathname}?model=${currentModel}&frame=${frameColor.substring(1)}&lens=${lensColor.substring(1)}`;
    
    
    navigator.clipboard.writeText(shareUrl).then(() => {
        alert('تم نسخ رابط المشاركة! يمكنك لصقه في أي مكان للمشاركة.');
    }, () => {
        alert('الرابط: ' + shareUrl);
    });
}

function addToWishlist() {
    alert('تمت إضافة النظارة إلى المفضلة!');
   
}

function checkout() {
    
    alert('سيتم توجيهك إلى صفحة الدفع. شكراً لاختيارك!');
}


function setupEventListeners() {
    document.querySelectorAll('.model-card').forEach(card => {
        card.addEventListener('click', function() {
            selectModel(this.dataset.model);
        });
    });
}