/**
 * Procedural Animation & Kinematics Controller for 3D Virtual Human
 * Frame-rate independent physics, viseme phoneme generation, and IK pointing.
 */

import * as THREE from 'three';
import { CharacterAction, VirtualHumanConfig } from '../../types/agent';
import { HumanJoints } from './humanRig';

export class VirtualHumanAnimator {
  private joints: HumanJoints;
  private config: VirtualHumanConfig;
  private currentAction: CharacterAction = 'idle';
  private actionTime: number = 0;
  private targetPointerPos: THREE.Vector3 = new THREE.Vector3(0, 1.2, 1.5);
  private speechVisemeIntensity: number = 0;
  private eyeBlinkTimer: number = 0;
  private eyeBlinking: boolean = false;

  // Pre-allocated math scratch variables to avoid GC in the render loop
  private _targetRotHead = new THREE.Euler();
  private _targetRotRightArm = new THREE.Euler();
  private _targetRotLeftArm = new THREE.Euler();

  constructor(joints: HumanJoints, config: VirtualHumanConfig) {
    this.joints = joints;
    this.config = config;
  }

  public setAction(action: CharacterAction, targetCoords?: { x: number; y: number }) {
    this.currentAction = action;
    this.actionTime = 0;

    if (targetCoords) {
      // Map screen 0-100 coordinates to 3D world space for pointing
      const worldX = (targetCoords.x / 100 - 0.5) * 3.5;
      const worldY = 0.5 + (1 - targetCoords.y / 100) * 1.8;
      this.targetPointerPos.set(worldX, worldY, 1.2);
    }
  }

  public setVisemeIntensity(intensity: number) {
    this.speechVisemeIntensity = intensity;
  }

  public update(delta: number, elapsed: number) {
    this.actionTime += delta;

    // 1. Holographic pedestal continuous rotation
    if (this.joints.pedestal) {
      this.joints.pedestal.rotation.y = elapsed * 0.4;
    }

    // 2. Eye Blinking & Saccades
    this.updateEyes(delta, elapsed);

    // 3. Mouth Viseme / Lip-Sync
    this.updateLipSync(delta, elapsed);

    // 4. Action-specific Kinematics
    switch (this.currentAction) {
      case 'idle':
        this.animateIdle(elapsed, delta);
        break;
      case 'walking':
        this.animateWalking(elapsed, delta);
        break;
      case 'pointing':
        this.animatePointing(elapsed, delta);
        break;
      case 'typing':
        this.animateTyping(elapsed, delta);
        break;
      case 'speaking':
        this.animateSpeaking(elapsed, delta);
        break;
      case 'thinking':
        this.animateThinking(elapsed, delta);
        break;
      case 'verifying':
        this.animateVerifying(elapsed, delta);
        break;
      case 'emergency_halt':
        this.animateEmergencyHalt(delta);
        break;
      default:
        this.animateIdle(elapsed, delta);
    }
  }

  private updateEyes(delta: number, elapsed: number) {
    this.eyeBlinkTimer += delta;
    if (this.eyeBlinkTimer > 3.5 + Math.sin(elapsed) * 1.5) {
      this.eyeBlinking = true;
      if (this.eyeBlinkTimer > 3.7 + Math.sin(elapsed) * 1.5) {
        this.eyeBlinking = false;
        this.eyeBlinkTimer = 0;
      }
    }

    const blinkScaleY = this.eyeBlinking ? 0.08 : 1.0;
    this.joints.eyeLeft.scale.y = THREE.MathUtils.damp(this.joints.eyeLeft.scale.y, blinkScaleY, 18, delta);
    this.joints.eyeRight.scale.y = THREE.MathUtils.damp(this.joints.eyeRight.scale.y, blinkScaleY, 18, delta);

    // Subtle eye saccade glances
    if (this.config.eyeTrackingEnabled && !this.eyeBlinking) {
      const saccadeX = Math.sin(elapsed * 0.8) * 0.008;
      const saccadeY = Math.cos(elapsed * 1.1) * 0.004;
      this.joints.eyeLeft.position.x = -0.045 + saccadeX;
      this.joints.eyeRight.position.x = 0.045 + saccadeX;
      this.joints.eyeLeft.position.y = 0.02 + saccadeY;
      this.joints.eyeRight.position.y = 0.02 + saccadeY;
    }
  }

  private updateLipSync(delta: number, elapsed: number) {
    let mouthTargetH = 0.015;
    let mouthTargetW = 0.05;

    if (this.currentAction === 'speaking' || this.speechVisemeIntensity > 0) {
      // Simulate vowels and consonants (visemes)
      const phonemeCycle = Math.sin(elapsed * 14) * 0.5 + 0.5;
      mouthTargetH = 0.015 + phonemeCycle * 0.04 * (this.speechVisemeIntensity || 0.8);
      mouthTargetW = 0.05 + Math.cos(elapsed * 9) * 0.015;
    }

    this.joints.mouth.scale.y = THREE.MathUtils.damp(this.joints.mouth.scale.y, mouthTargetH / 0.015, 16, delta);
    this.joints.mouth.scale.x = THREE.MathUtils.damp(this.joints.mouth.scale.x, mouthTargetW / 0.05, 14, delta);
  }

  private animateIdle(elapsed: number, delta: number) {
    // Breathing cycle
    const breath = Math.sin(elapsed * 1.6);
    this.joints.spine.position.y = THREE.MathUtils.damp(this.joints.spine.position.y, 0.12 + breath * 0.012, 6, delta);
    this.joints.torso.scale.x = THREE.MathUtils.damp(this.joints.torso.scale.x, 1 + breath * 0.02, 6, delta);
    this.joints.torso.scale.z = THREE.MathUtils.damp(this.joints.torso.scale.z, 1 + breath * 0.02, 6, delta);

    // Gentle head sway
    this.joints.head.rotation.y = THREE.MathUtils.damp(this.joints.head.rotation.y, Math.sin(elapsed * 0.6) * 0.06, 4, delta);
    this.joints.head.rotation.x = THREE.MathUtils.damp(this.joints.head.rotation.x, breath * 0.025, 4, delta);

    // Natural arm rests
    const leftArmShoulder = this.joints.leftArm.shoulder;
    const rightArmShoulder = this.joints.rightArm.shoulder;
    leftArmShoulder.rotation.x = THREE.MathUtils.damp(leftArmShoulder.rotation.x, Math.sin(elapsed * 1.6) * 0.04, 6, delta);
    leftArmShoulder.rotation.z = THREE.MathUtils.damp(leftArmShoulder.rotation.z, 0.08, 6, delta);
    rightArmShoulder.rotation.x = THREE.MathUtils.damp(rightArmShoulder.rotation.x, -Math.sin(elapsed * 1.6) * 0.04, 6, delta);
    rightArmShoulder.rotation.z = THREE.MathUtils.damp(rightArmShoulder.rotation.z, -0.08, 6, delta);

    // Reset legs & laser
    this.resetLegs(delta);
    this.setLaserVisible(false);
  }

  private animateWalking(elapsed: number, delta: number) {
    const walkSpeed = 5.5;
    const stride = Math.sin(elapsed * walkSpeed);
    const counterStride = Math.cos(elapsed * walkSpeed);

    // Leg swings and knee flexion
    this.joints.leftLeg.hip.rotation.x = THREE.MathUtils.damp(this.joints.leftLeg.hip.rotation.x, stride * 0.45, 12, delta);
    this.joints.rightLeg.hip.rotation.x = THREE.MathUtils.damp(this.joints.rightLeg.hip.rotation.x, -stride * 0.45, 12, delta);

    const leftKneeBend = stride > 0 ? stride * 0.5 : 0.05;
    const rightKneeBend = stride < 0 ? -stride * 0.5 : 0.05;
    this.joints.leftLeg.knee.rotation.x = THREE.MathUtils.damp(this.joints.leftLeg.knee.rotation.x, leftKneeBend, 12, delta);
    this.joints.rightLeg.knee.rotation.x = THREE.MathUtils.damp(this.joints.rightLeg.knee.rotation.x, rightKneeBend, 12, delta);

    // Reciprocal arm swings
    this.joints.leftArm.shoulder.rotation.x = THREE.MathUtils.damp(this.joints.leftArm.shoulder.rotation.x, -stride * 0.4, 10, delta);
    this.joints.rightArm.shoulder.rotation.x = THREE.MathUtils.damp(this.joints.rightArm.shoulder.rotation.x, stride * 0.4, 10, delta);

    // Pelvic bounce and tilt
    this.joints.body.position.y = THREE.MathUtils.damp(this.joints.body.position.y, 0.95 + Math.abs(counterStride) * 0.035, 12, delta);
    this.joints.pelvis.rotation.y = THREE.MathUtils.damp(this.joints.pelvis.rotation.y, stride * 0.1, 10, delta);
    this.joints.head.rotation.y = THREE.MathUtils.damp(this.joints.head.rotation.y, -stride * 0.05, 10, delta);

    this.setLaserVisible(false);
  }

  private animatePointing(elapsed: number, delta: number) {
    // Raise right arm and aim forward/toward target
    const rightArmShoulder = this.joints.rightArm.shoulder;
    const rightElbow = this.joints.rightArm.elbow;

    // Angle arm to point toward the designated target coordinates
    rightArmShoulder.rotation.x = THREE.MathUtils.damp(rightArmShoulder.rotation.x, -Math.PI / 2 + 0.15, 10, delta);
    rightArmShoulder.rotation.y = THREE.MathUtils.damp(rightArmShoulder.rotation.y, this.targetPointerPos.x * 0.25, 10, delta);
    rightArmShoulder.rotation.z = THREE.MathUtils.damp(rightArmShoulder.rotation.z, -0.2, 10, delta);
    rightElbow.rotation.x = THREE.MathUtils.damp(rightElbow.rotation.x, 0.15, 10, delta);

    // Enable laser beam from right index finger to screen coordinate
    this.setLaserVisible(true);

    // Head turns to look at target
    this.joints.head.rotation.y = THREE.MathUtils.damp(this.joints.head.rotation.y, this.targetPointerPos.x * 0.2, 8, delta);
    this.joints.head.rotation.x = THREE.MathUtils.damp(this.joints.head.rotation.x, -0.1, 8, delta);

    // Left arm relaxed at side
    this.joints.leftArm.shoulder.rotation.x = THREE.MathUtils.damp(this.joints.leftArm.shoulder.rotation.x, 0.1, 6, delta);
    this.joints.leftArm.shoulder.rotation.z = THREE.MathUtils.damp(this.joints.leftArm.shoulder.rotation.z, 0.15, 6, delta);

    this.resetLegs(delta);
  }

  private animateTyping(elapsed: number, delta: number) {
    const typeSpeed = 16;
    const lTap = Math.sin(elapsed * typeSpeed);
    const rTap = Math.cos(elapsed * typeSpeed);

    // Both arms brought forward
    this.joints.leftArm.shoulder.rotation.x = THREE.MathUtils.damp(this.joints.leftArm.shoulder.rotation.x, -Math.PI / 3, 12, delta);
    this.joints.leftArm.shoulder.rotation.z = THREE.MathUtils.damp(this.joints.leftArm.shoulder.rotation.z, 0.35, 12, delta);
    this.joints.leftArm.elbow.rotation.x = THREE.MathUtils.damp(this.joints.leftArm.elbow.rotation.x, 0.95 + lTap * 0.12, 16, delta);

    this.joints.rightArm.shoulder.rotation.x = THREE.MathUtils.damp(this.joints.rightArm.shoulder.rotation.x, -Math.PI / 3, 12, delta);
    this.joints.rightArm.shoulder.rotation.z = THREE.MathUtils.damp(this.joints.rightArm.shoulder.rotation.z, -0.35, 12, delta);
    this.joints.rightArm.elbow.rotation.x = THREE.MathUtils.damp(this.joints.rightArm.elbow.rotation.x, 0.95 + rTap * 0.12, 16, delta);

    // Head looking down toward keyboard
    this.joints.head.rotation.x = THREE.MathUtils.damp(this.joints.head.rotation.x, 0.35, 8, delta);
    this.joints.head.rotation.y = THREE.MathUtils.damp(this.joints.head.rotation.y, 0, 8, delta);

    this.resetLegs(delta);
    this.setLaserVisible(false);
  }

  private animateSpeaking(elapsed: number, delta: number) {
    // Conversational head nodding and hand gestures
    const nod = Math.sin(elapsed * 4) * 0.08;
    this.joints.head.rotation.x = THREE.MathUtils.damp(this.joints.head.rotation.x, nod, 8, delta);
    this.joints.head.rotation.y = THREE.MathUtils.damp(this.joints.head.rotation.y, Math.sin(elapsed * 2) * 0.15, 6, delta);

    // Expressive right hand
    this.joints.rightArm.shoulder.rotation.x = THREE.MathUtils.damp(this.joints.rightArm.shoulder.rotation.x, -Math.PI / 4 + Math.sin(elapsed * 3) * 0.15, 8, delta);
    this.joints.rightArm.shoulder.rotation.z = THREE.MathUtils.damp(this.joints.rightArm.shoulder.rotation.z, -0.3, 8, delta);
    this.joints.rightArm.elbow.rotation.x = THREE.MathUtils.damp(this.joints.rightArm.elbow.rotation.x, 0.6, 8, delta);

    this.resetLegs(delta);
    this.setLaserVisible(false);
  }

  private animateThinking(elapsed: number, delta: number) {
    // Hand to chin posture
    this.joints.rightArm.shoulder.rotation.x = THREE.MathUtils.damp(this.joints.rightArm.shoulder.rotation.x, -Math.PI / 2.3, 8, delta);
    this.joints.rightArm.shoulder.rotation.z = THREE.MathUtils.damp(this.joints.rightArm.shoulder.rotation.z, -0.55, 8, delta);
    this.joints.rightArm.elbow.rotation.x = THREE.MathUtils.damp(this.joints.rightArm.elbow.rotation.x, 1.45, 8, delta);

    // Head tilted thoughtfully
    this.joints.head.rotation.x = THREE.MathUtils.damp(this.joints.head.rotation.x, -0.15, 6, delta);
    this.joints.head.rotation.z = THREE.MathUtils.damp(this.joints.head.rotation.z, 0.15, 6, delta);
    this.joints.head.rotation.y = THREE.MathUtils.damp(this.joints.head.rotation.y, 0.2, 6, delta);

    this.resetLegs(delta);
    this.setLaserVisible(false);
  }

  private animateVerifying(elapsed: number, delta: number) {
    // Head scanning left to right inspecting screen
    const scan = Math.sin(elapsed * 3) * 0.35;
    this.joints.head.rotation.y = THREE.MathUtils.damp(this.joints.head.rotation.y, scan, 10, delta);
    this.joints.head.rotation.x = THREE.MathUtils.damp(this.joints.head.rotation.x, 0.05, 10, delta);

    // Alert posture
    this.joints.leftArm.shoulder.rotation.x = THREE.MathUtils.damp(this.joints.leftArm.shoulder.rotation.x, 0, 8, delta);
    this.joints.rightArm.shoulder.rotation.x = THREE.MathUtils.damp(this.joints.rightArm.shoulder.rotation.x, 0, 8, delta);

    this.resetLegs(delta);
    this.setLaserVisible(false);
  }

  private animateEmergencyHalt(delta: number) {
    // Defensive rigid lockdown stance
    this.joints.body.position.y = THREE.MathUtils.damp(this.joints.body.position.y, 0.92, 14, delta);
    this.joints.leftLeg.hip.rotation.z = THREE.MathUtils.damp(this.joints.leftLeg.hip.rotation.z, -0.12, 12, delta);
    this.joints.rightLeg.hip.rotation.z = THREE.MathUtils.damp(this.joints.rightLeg.hip.rotation.z, 0.12, 12, delta);

    this.joints.leftArm.shoulder.rotation.x = THREE.MathUtils.damp(this.joints.leftArm.shoulder.rotation.x, 0.15, 12, delta);
    this.joints.rightArm.shoulder.rotation.x = THREE.MathUtils.damp(this.joints.rightArm.shoulder.rotation.x, 0.15, 12, delta);
    this.joints.head.rotation.set(0, 0, 0);

    this.setLaserVisible(false);
  }

  private resetLegs(delta: number) {
    this.joints.leftLeg.hip.rotation.set(0, 0, 0);
    this.joints.rightLeg.hip.rotation.set(0, 0, 0);
    this.joints.leftLeg.knee.rotation.set(0, 0, 0);
    this.joints.rightLeg.knee.rotation.set(0, 0, 0);
    this.joints.body.position.y = THREE.MathUtils.damp(this.joints.body.position.y, 0.95, 8, delta);
    this.joints.pelvis.rotation.set(0, 0, 0);
  }

  private setLaserVisible(visible: boolean) {
    if (this.joints.rightArm.laser) {
      this.joints.rightArm.laser.visible = visible;
    }
  }
}
