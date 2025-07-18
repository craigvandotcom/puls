"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Edit3, Upload } from "lucide-react";

interface CameraCaptureProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCapture: (imageData: string) => void;
  onManualEntry: () => void;
  title: string;
}

export function CameraCapture({
  open,
  onOpenChange,
  onCapture,
  onManualEntry,
  title,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [open]);

  // Attach video stream to video element when stream is available
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(err => {
        console.error("Error playing video:", err);
      });
    }
  }, [stream]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 1280 },
        },
      });

      setStream(mediaStream);
      setIsLoading(false);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Unable to access camera. Please check permissions.");
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data as base64
    const imageData = canvas.toDataURL("image/jpeg", 0.8);

    // Stop camera and close dialog
    stopCamera();
    onOpenChange(false);

    // Pass image data to parent
    onCapture(imageData);
  };

  const handleManualEntry = () => {
    stopCamera();
    onOpenChange(false);
    onManualEntry();
  };

  const handleClose = () => {
    stopCamera();
    onOpenChange(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result as string;
      onOpenChange(false);
      onCapture(imageData);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          </div>

          {/* Camera View */}
          <div className="relative bg-black">
            {isLoading && (
              <div className="aspect-square flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Starting camera...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="aspect-square flex items-center justify-center bg-gray-100">
                <div className="text-center p-4">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">{error}</p>
                  <div className="flex flex-col gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={startCamera}>
                      Try Again
                    </Button>
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Button variant="outline" size="sm" className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isLoading && !error && (
              <div className="relative aspect-square overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />

                {/* Camera overlay grid */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-full border-2 border-white/20">
                    <div className="w-full h-1/3 border-b border-white/20"></div>
                    <div className="w-full h-1/3 border-b border-white/20"></div>
                  </div>
                  <div className="absolute inset-0">
                    <div className="w-1/3 h-full border-r border-white/20 float-left"></div>
                    <div className="w-1/3 h-full border-r border-white/20 float-left"></div>
                  </div>
                </div>

                {/* Transparent Capture Overlay */}
                <div
                  className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors active:bg-black/30"
                  onClick={captureImage}
                >
                  <div className="w-20 h-20 rounded-full border-4 border-white/80 bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            )}

            {/* Hidden canvas for capture */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Action Buttons */}
          <div className="p-4">
            <div className="flex gap-3">
              <Button
                onClick={handleClose}
                variant="outline"
                className="w-16 h-12 bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300"
                size="lg"
              >
                Cancel
              </Button>

              <Button
                onClick={handleManualEntry}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <Edit3 className="h-5 w-5 mr-2" />
                Manual Entry
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
