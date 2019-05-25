export default class AssetsDatabase {
    
    constructor(scene, finishCallback) {

        this.scene = scene;

        this.meshes = [];
        this.sounds = [];

        this.manager = new BABYLON.AssetsManager(this.scene);

        this.manager.onFinish = (tasks) => {
            if(finishCallback) finishCallback(tasks);
        };

    }

    /**
     * Adds a sound to be loaded
     * @param {*} name 
     * @param {*} file 
     * @param {*} options 
     */
    addSound(name, file, options) {
        let fileTask = this.manager.addBinaryFileTask(name + '__SoundTask', file);

        fileTask.onSuccess = (task) => {
            this.sounds[name] = new BABYLON.Sound(name, task.data, this.scene, null, options);
            
            // Execute a success callback
            if(options.onSuccess) {
                options.onSuccess(this.sounds[name]);
            }
        }

        return this.sounds[name];
    }

    /**
     * Adds a music (sound with some predefined parametes that can be overwriten)
     * By default, musics are automatically played in loop
     * @param {*} name 
     * @param {*} file 
     * @param {*} options 
     */
    addMusic(name, file, options = {}) {

        options.loop = (typeof options.loop !== 'undefined') ? options.loop : true;
        options.volume = (typeof options.volume !== 'undefined') ? options.volume : 0.5;
        options.autoplay = (typeof options.autoplay !== 'undefined') ? options.autoplay : true;

        return this.addSound(name, file, options);

    }

    addMergedMesh(name, file, options) {
        return this.addMesh(name, file, options, true);
    }

    addMesh(name, file, options = {}, mergeMeshes = false) {
        let fileTask = this.manager.addMeshTask(name + '__MeshTask', '', file);

        fileTask.onSuccess = (task) => {
            
            let mesh = null;
            
            try {
                if(mergeMeshes) {
                    mesh = BABYLON.Mesh.MergeMeshes(task.loadedMeshes);   
                } else {
                    mesh = task.loadedMeshes[0];
                }

                mesh.setEnabled(false);
    
                this.meshes[name] = mesh;
                
                // Execute a success callback
                if(options.onSuccess) {
                    options.onSuccess(this.meshes[name]);
                }
            } catch (error) {
                console.error(error)
            }

        }

        return this.meshes[name];
    }

    addAnimatedMesh() {
        // BABYLON.SceneLoader.ImportMesh("", '/assets/models/weapons/rifle/', 'rifle.gltf', this.scene, (newMeshes, particleSystems, skeletons) => {
            
        //     console.log(skeletons)
            
        //     this.scene.beginHierarchyAnimation(newMeshes[0], true, 0, 100, true, 1, () => {
        //         console.log('animation end')
        //     });
        // })
    }

    cloneComplexMeshes(meshes, quantity = 1) {
        let clones = [];

        for (var i = 0; i < quantity; i++) {

            var clone = [];

            for (var j = 0; j < meshes.length; j++) {
                clone[j] = meshes[j].clone("clone" + j);
                
                if(meshes[j].skeleton) {
                    clone[j].skeleton = meshes[j].skeleton.clone();
                }
            }

            clones[i] = clone;
        }

        return clones;
    }

    getMesh(name) {
        return this.meshes[name];     
    }

    getSound(name) {
        return this.sounds[name];
    }

    load() {
        this.manager.load();
    }

}