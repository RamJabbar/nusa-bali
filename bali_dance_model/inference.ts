/**
 * inference.ts
 * Type-safe ONNX Runtime Web inference for Balinese Dance Classification.
 * Strictly typed (no 'any').
 */

import * as ort from 'onnxruntime-web';

export const BALI_DANCE_CLASSES = [
  "Baris",
  "Barong",
  "Condong",
  "Janger",
  "Kecak",
  "Pendet",
  "Pendet_Penyambutan",
  "Rejang_Sari",
  "Truna_jaya"
] as const;

export type BaliDanceClass = typeof BALI_DANCE_CLASSES[number];

export interface ClassificationResult {
  predictedClass: BaliDanceClass | "Bukan Tari Bali / Tidak Dikenali";
  confidence: number;
  entropy: number;
  isHallucination: boolean;
  latencyMs: number;
  allProbabilities: Record<BaliDanceClass, number>;
}

export interface ModelConfig {
  modelPath: string;
  confidenceThreshold?: number; // default: 0.70
  entropyThreshold?: number;    // default: 1.40
}

const DEFAULT_CONFIDENCE_THRESHOLD = 0.70;
const DEFAULT_ENTROPY_THRESHOLD = 1.40;

const IMAGENET_MEAN = [0.485, 0.456, 0.406];
const IMAGENET_STD = [0.229, 0.224, 0.225];

export class BaliDanceClassifier {
  private session: ort.InferenceSession | null = null;
  private readonly config: ModelConfig;

  constructor(config: ModelConfig) {
    this.config = config;
  }

  public async load(): Promise<void> {
    this.session = await ort.InferenceSession.create(this.config.modelPath, {
      executionProviders: ['wasm']
    });
  }

  /**
   * Preprocesses an HTMLImageElement or HTMLCanvasElement to NCHW Float32Array tensor
   * with white-compositing to eliminate transparent cutout black-border shortcuts.
   */
  public preprocess(imageSource: HTMLImageElement | HTMLCanvasElement): ort.Tensor {
    const canvas = document.createElement('canvas');
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error("Unable to obtain 2D canvas rendering context.");
    }

    // Composite over white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 224, 224);
    ctx.drawImage(imageSource, 0, 0, 224, 224);

    const { data } = ctx.getImageData(0, 0, 224, 224);
    const float32Data = new Float32Array(3 * 224 * 224);

    for (let i = 0; i < 224 * 224; i++) {
      const r = data[i * 4] / 255.0;
      const g = data[i * 4 + 1] / 255.0;
      const b = data[i * 4 + 2] / 255.0;

      float32Data[i] = (r - IMAGENET_MEAN[0]) / IMAGENET_STD[0];
      float32Data[224 * 224 + i] = (g - IMAGENET_MEAN[1]) / IMAGENET_STD[1];
      float32Data[2 * 224 * 224 + i] = (b - IMAGENET_MEAN[2]) / IMAGENET_STD[2];
    }

    return new ort.Tensor('float32', float32Data, [1, 3, 224, 224]);
  }

  /**
   * Classify image with strict anti-hallucination and confidence calibration.
   */
  public async classify(imageSource: HTMLImageElement | HTMLCanvasElement): Promise<ClassificationResult> {
    if (!this.session) {
      throw new Error("Classifier session not initialized. Call .load() first.");
    }

    const tensor = this.preprocess(imageSource);
    const startTime = performance.now();
    const output = await this.session.run({ input: tensor });
    const latencyMs = Math.round(performance.now() - startTime);

    const probs = output.probabilities.data as Float32Array;

    let maxIdx = 0;
    let maxProb = probs[0];
    let entropy = 0;

    const allProbabilities = {} as Record<BaliDanceClass, number>;

    for (let i = 0; i < BALI_DANCE_CLASSES.length; i++) {
      const p = probs[i];
      allProbabilities[BALI_DANCE_CLASSES[i]] = p;
      if (p > maxProb) {
        maxProb = p;
        maxIdx = i;
      }
      if (p > 1e-7) {
        entropy -= p * Math.log(p);
      }
    }

    const confThreshold = this.config.confidenceThreshold ?? DEFAULT_CONFIDENCE_THRESHOLD;
    const entThreshold = this.config.entropyThreshold ?? DEFAULT_ENTROPY_THRESHOLD;

    const isHallucination = maxProb < confThreshold || entropy > entThreshold;

    return {
      predictedClass: isHallucination ? "Bukan Tari Bali / Tidak Dikenali" : BALI_DANCE_CLASSES[maxIdx],
      confidence: maxProb,
      entropy,
      isHallucination,
      latencyMs,
      allProbabilities
    };
  }
}
