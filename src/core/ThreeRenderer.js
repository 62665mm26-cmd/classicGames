import * as THREE from 'https://esm.sh/three';

export class ThreeRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();

    // Set a dark background
    this.scene.background = new THREE.Color('#111');

    this.camera = new THREE.PerspectiveCamera(
      45,
      canvas.width / canvas.height,
      0.1,
      1000
    );
    // Position camera so that the grid (Z=0 plane) is visible
    // The grid center will be around (15, -10) based on typical canvas size and scale.
    // Let's set it dynamically or just provide a top-down angled view.
    this.camera.position.set(15, -15, 35);
    this.camera.lookAt(15, -10, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setSize(canvas.width, canvas.height);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 20);
    this.scene.add(directionalLight);

    this.meshes = [];

    // Resize handling is tricky with fixed canvas size, but let's adhere to AGENTS.md
    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.onWindowResize);
  }

  onWindowResize() {
    // If we want the canvas to stay fixed (as it is in index.html width="600" height="400"),
    // this isn't strictly necessary, but good practice.
    // Assuming the container might resize it:
    // this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    // this.camera.updateProjectionMatrix();
    // this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
  }

  clearMeshes() {
    this.meshes.forEach(mesh => {
      this.scene.remove(mesh);
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    });
    this.meshes = [];
  }

  addMesh(mesh) {
    this.scene.add(mesh);
    this.meshes.push(mesh);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    window.removeEventListener('resize', this.onWindowResize);
    this.clearMeshes();
    this.renderer.dispose();
  }
}
