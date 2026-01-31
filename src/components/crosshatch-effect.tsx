"use client";

import { forwardRef, useMemo } from "react";
import { Effect } from "postprocessing";
import { Uniform, Color } from "three";

const fragmentShader = `
uniform float spacing;
uniform float thickness;
uniform float angle;
uniform float contrast;
uniform float edgeStrength;
uniform float wave;
uniform float waveFrequency;
uniform float lineWeight;
uniform vec3 inkColor;
uniform vec3 paperColor;
uniform vec2 resolution;

// Sobel edge detection
float sobel(vec2 uv) {
    vec2 texel = 1.0 / resolution;
    
    float tl = dot(texture2D(inputBuffer, uv + vec2(-texel.x, texel.y)).rgb, vec3(0.299, 0.587, 0.114));
    float t  = dot(texture2D(inputBuffer, uv + vec2(0.0, texel.y)).rgb, vec3(0.299, 0.587, 0.114));
    float tr = dot(texture2D(inputBuffer, uv + vec2(texel.x, texel.y)).rgb, vec3(0.299, 0.587, 0.114));
    float l  = dot(texture2D(inputBuffer, uv + vec2(-texel.x, 0.0)).rgb, vec3(0.299, 0.587, 0.114));
    float r  = dot(texture2D(inputBuffer, uv + vec2(texel.x, 0.0)).rgb, vec3(0.299, 0.587, 0.114));
    float bl = dot(texture2D(inputBuffer, uv + vec2(-texel.x, -texel.y)).rgb, vec3(0.299, 0.587, 0.114));
    float b  = dot(texture2D(inputBuffer, uv + vec2(0.0, -texel.y)).rgb, vec3(0.299, 0.587, 0.114));
    float br = dot(texture2D(inputBuffer, uv + vec2(texel.x, -texel.y)).rgb, vec3(0.299, 0.587, 0.114));
    
    float gx = -tl - 2.0*l - bl + tr + 2.0*r + br;
    float gy = -tl - 2.0*t - tr + bl + 2.0*b + br;
    
    return sqrt(gx*gx + gy*gy);
}

// Hatching line function
float hatchLine(vec2 uv, float angleRad, float darkness, float baseSpacing, float baseThickness) {
    // Apply wave distortion
    float waveOffset = wave * sin(uv.y * waveFrequency * 100.0 + uv.x * waveFrequency * 50.0) * 0.01;
    
    // Rotate UV coordinates
    float c = cos(angleRad);
    float s = sin(angleRad);
    vec2 rotUV = vec2(
        uv.x * c - uv.y * s + waveOffset,
        uv.x * s + uv.y * c
    );
    
    // Calculate line pattern
    float linePos = mod(rotUV.x * resolution.x, baseSpacing);
    float lineThickness = baseThickness * (1.0 + lineWeight * (1.0 - darkness));
    
    // Only draw line if area is dark enough
    float line = smoothstep(lineThickness, lineThickness * 0.5, abs(linePos - baseSpacing * 0.5));
    
    return line;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec4 texColor = texture2D(inputBuffer, uv);
    
    // Calculate luminance with contrast adjustment
    float lum = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    lum = pow(lum, contrast);
    float darkness = 1.0 - lum;
    
    // Base angle in radians
    float baseAngle = angle * 3.14159265 / 180.0;
    
    // Initialize with paper color (no hatching)
    float totalHatch = 0.0;
    
    // Layer 1: Primary hatching (light shadows, ~20% darkness threshold)
    if (darkness > 0.2) {
        totalHatch = max(totalHatch, hatchLine(uv, baseAngle, darkness, spacing, thickness) * smoothstep(0.15, 0.25, darkness));
    }
    
    // Layer 2: Cross hatching at 90° (medium shadows, ~40% darkness)
    if (darkness > 0.4) {
        totalHatch = max(totalHatch, hatchLine(uv, baseAngle + 1.5708, darkness, spacing, thickness) * smoothstep(0.35, 0.45, darkness));
    }
    
    // Layer 3: Diagonal hatching at 45° (darker areas, ~60% darkness)
    if (darkness > 0.6) {
        totalHatch = max(totalHatch, hatchLine(uv, baseAngle + 0.7854, darkness, spacing * 0.8, thickness) * smoothstep(0.55, 0.65, darkness));
    }
    
    // Layer 4: Opposite diagonal (very dark, ~75% darkness)
    if (darkness > 0.75) {
        totalHatch = max(totalHatch, hatchLine(uv, baseAngle - 0.7854, darkness, spacing * 0.6, thickness) * smoothstep(0.7, 0.8, darkness));
    }
    
    // Add edge detection contours
    float edge = sobel(uv) * edgeStrength;
    totalHatch = max(totalHatch, edge);
    
    // Mix ink and paper colors
    vec3 finalColor = mix(paperColor, inkColor, clamp(totalHatch, 0.0, 1.0));
    
    outputColor = vec4(finalColor, texColor.a);
}
`;

// Custom Effect class
class CrosshatchEffectImpl extends Effect {
  constructor({
    spacing = 10.0,
    thickness = 2.2,
    angle = 66.0,
    contrast = 1.01,
    edgeStrength = 1.0,
    wave = 0.33,
    waveFrequency = 3.0,
    lineWeight = 0.0,
    inkColor = new Color("#ff8100"),
    paperColor = new Color("#f5f5dc"),
    resolution = [1920, 1080],
  } = {}) {
    super("CrosshatchEffect", fragmentShader, {
      uniforms: new Map([
        ["spacing", new Uniform(spacing)],
        ["thickness", new Uniform(thickness)],
        ["angle", new Uniform(angle)],
        ["contrast", new Uniform(contrast)],
        ["edgeStrength", new Uniform(edgeStrength)],
        ["wave", new Uniform(wave)],
        ["waveFrequency", new Uniform(waveFrequency)],
        ["lineWeight", new Uniform(lineWeight)],
        ["inkColor", new Uniform(inkColor)],
        ["paperColor", new Uniform(paperColor)],
        ["resolution", new Uniform(resolution)],
      ]),
    });
  }
}

interface CrosshatchEffectProps {
  spacing?: number;
  thickness?: number;
  angle?: number;
  contrast?: number;
  edgeStrength?: number;
  wave?: number;
  waveFrequency?: number;
  lineWeight?: number;
  inkColor?: string;
  paperColor?: string;
}

export const CrosshatchEffect = forwardRef<CrosshatchEffectImpl, CrosshatchEffectProps>(
  function CrosshatchEffect(
    {
      spacing = 10.0,
      thickness = 2.2,
      angle = 66.0,
      contrast = 1.01,
      edgeStrength = 1.0,
      wave = 0.33,
      waveFrequency = 3.0,
      lineWeight = 0.0,
      inkColor = "#ff8100",
      paperColor = "#f5f5dc",
    },
    ref
  ) {
    const effect = useMemo(() => {
      return new CrosshatchEffectImpl({
        spacing,
        thickness,
        angle,
        contrast,
        edgeStrength,
        wave,
        waveFrequency,
        lineWeight,
        inkColor: new Color(inkColor),
        paperColor: new Color(paperColor),
        resolution: [window?.innerWidth || 1920, window?.innerHeight || 1080],
      });
    }, []);

    // Update uniforms when props change
    useMemo(() => {
      effect.uniforms.get("spacing")!.value = spacing;
      effect.uniforms.get("thickness")!.value = thickness;
      effect.uniforms.get("angle")!.value = angle;
      effect.uniforms.get("contrast")!.value = contrast;
      effect.uniforms.get("edgeStrength")!.value = edgeStrength;
      effect.uniforms.get("wave")!.value = wave;
      effect.uniforms.get("waveFrequency")!.value = waveFrequency;
      effect.uniforms.get("lineWeight")!.value = lineWeight;
      effect.uniforms.get("inkColor")!.value = new Color(inkColor);
      effect.uniforms.get("paperColor")!.value = new Color(paperColor);
    }, [effect, spacing, thickness, angle, contrast, edgeStrength, wave, waveFrequency, lineWeight, inkColor, paperColor]);

    return <primitive ref={ref} object={effect} />;
  }
);
