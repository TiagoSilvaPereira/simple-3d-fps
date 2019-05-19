import UI from '../../base/UI';
import Level from '../../base/Level';

export default class FirstLevel extends Level {

    setProperties() {

        // Menu
        this.menu = null;
        this.canFire = true;
        this.currentFireRate = 0;
        this.fireRate = 1;
        
    }

    setupAssets() {

        this.assets.addMergedMesh('shotgun', '/assets/models/weapons/shotgun.obj');

        // this.assets.addMusic('music', '/assets/musics/music.mp3');
        // this.assets.addSound('sound', '/assets/sounds/sound.mp3', { volume: 0.4 });
        
    }

    buildScene() {
        
        this.scene.clearColor = new BABYLON.Color3.FromHexString(GAME.options.backgroundColor);
        var light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, 0), this.scene);

        this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
        this.scene.collisionsEnabled = true;

        this.createMenus();

        // Sets the active camera
        this.camera = this.createCamera();
        this.scene.activeCamera = this.camera;

        this.camera.attachControl(GAME.canvas, true);

        let ground = BABYLON.Mesh.CreateGround("ground",  100,  100, 2, this.scene);
        ground.checkCollisions = true;
        let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", this.scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("/assets/images/grass.jpg", this.scene);
        groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        ground.material = groundMaterial;

        this.pointerLock();

        this.addWeapon();
        this.addTargets();

        this.setupEventListeners();
    }

    addWeapon() {
        this.weapon = this.assets.getMesh('shotgun');
        this.weapon.isVisible = true;
        this.weapon.rotationQuaternion = null;
        // weapon.rotation.x = -Math.PI/2;
        this.weapon.rotation.y = -Math.PI/2;
        this.weapon.parent = this.camera;
        this.weapon.position = new BABYLON.Vector3(0.7,-0.45,1.3);
        this.weapon.scaling = new BABYLON.Vector3(2, 2, 2);
    }

    addTargets() {
        for(var targetsQuantity = 0; targetsQuantity < 10; targetsQuantity++) {
            let target = BABYLON.MeshBuilder.CreateSphere("target", {diameter: 1.5, segments: 2}, this.scene);

            target.position.x = Math.floor((Math.random() * 50));
            target.position.z = Math.floor((Math.random() * 50));
            target.position.y = 2;

            this.targetMaterial = new BABYLON.StandardMaterial('targetMaterial', this.scene);
            this.targetMaterial.diffuseColor = new BABYLON.Color3.FromHexString('#6ab04c');
            this.targetMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

            target.material = this.targetMaterial;
        }
    }

    setupEventListeners() {
        GAME.canvas.addEventListener('click', () => {
            var width = this.scene.getEngine().getRenderWidth();
            var height = this.scene.getEngine().getRenderHeight();
            
            if (this.controlEnabled) {
                var pickInfo = this.scene.pick(width/2, height/2, null, false, this.camera);
                this.fire(pickInfo);
            }
        }, false);
    }

    fire(pickInfo) {
        console.log(pickInfo.pickedMesh, this.canFire);
        if (this.canFire) {
            if (pickInfo.hit && pickInfo.pickedMesh.name === "target") {
                console.log(pickInfo.pickedMesh);
                pickInfo.pickedMesh.dispose();
            } else {
                if(pickInfo.pickedPoint) {
                    var b = BABYLON.Mesh.CreateBox("box", 0.1, this.scene);
                    b.position = pickInfo.pickedPoint.clone();
                }
            }
            
            this.interpolate(this.weapon.position, 'z', 1, 100);
            
            setTimeout(() => {
                this.interpolate(this.weapon.position, 'z', 1.3, 100);
            }, 100);

            this.canFire = false;
        }
    }

    createMenus() {
        // this.menu = new UI('runnerMenuUI');
        
        // let text = GAME.isMobile() ? 'You are in a mobile device' : 'You are not in a mobile device';

        // // Small tutorial text
        // this.menu.addText(text, {
        //     'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
        // });

        // this.menu.addButton('backButton', 'Return to Home', {
        //     'top': '70px',
        //     'onclick': () => GAME.goToLevel('HomeMenuLevel')
        // });
    }

    createCamera() {
        var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 100, 0), this.scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        
        camera.applyGravity = true;
        camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
        camera.checkCollisions = true;
        camera._needMoveForGravity = true;

        // Reducing the minimum visible FOV to show the Weapon correctly 
        camera.minZ = 0;

        // Remap keys to move with ZQSD
        // camera.keysUp = [87]; // W
        // camera.keysDown = [83]; // S
        // camera.keysLeft = [65]; // A
        // camera.keysRight = [68]; // D
        
        // camera.speed = 10;
        // camera.inertia = 5;
        // camera.angularSensibility = 1000;
        
        return camera;
    }

    beforeRender() {
        if(!GAME.isPaused()) {
            if (!this.canFire) {
                this.currentFireRate -= GAME.engine.getDeltaTime();
                console.log(this.currentFireRate);
                if (this.currentFireRate <= 0) {
                    this.canFire = true;
                    this.currentFireRate = this.fireRate;
                }
            }
        }
    }

    pointerLock() {
        let canvas = GAME.canvas;
        
        // On click event, request pointer lock
        canvas.addEventListener("click", function(evt) {
            canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
            if (canvas.requestPointerLock) {
                canvas.requestPointerLock();
            }
        }, false);

        // Event listener when the pointerlock is updated (or removed by pressing ESC for example).
        var pointerlockchange = (event) => {
            this.controlEnabled = (
                            document.mozPointerLockElement === canvas
                            || document.webkitPointerLockElement === canvas
                            || document.msPointerLockElement === canvas
                            || document.pointerLockElement === canvas);
            // If the user is alreday locked
            if (!this.controlEnabled) {
                this.camera.detachControl(canvas);
            } else {
                this.camera.attachControl(canvas);
            }
        };

        // Attach events to the document
        document.addEventListener("pointerlockchange", pointerlockchange, false);
        document.addEventListener("mspointerlockchange", pointerlockchange, false);
        document.addEventListener("mozpointerlockchange", pointerlockchange, false);
        document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
    }
    
}