class MRClass {
  constructor() {
    this.stream = null;
    this.mediaRecorder = null;
    this.blob = null;
    this.blobURL = null;
    this.stopPromise = {};
  }

  clearStream() {
    this.stream = null;
    this.mediaRecorder = null;
    this.chunks = [];
    this.blob = null;
    this.blobURL = null;
    this.stopPromise = {};
  }

  async startStream(constraints) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.stream = stream;
      return stream;
    } catch (error) {
      console.log("MR class : Error in starting stream:", error);
      return { message: "Error in starting stream" };
    }
  }

  async onStreamConfiguration(blobOption) {
    const chunks = [];

    this.mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, blobOption);
      const blobURL = URL.createObjectURL(blob);

      this.blob = blob;
      this.blobURL = blobURL;

      if (this.stopPromise && (blob || blobURL)) {
        this.stopPromise.resolve({ blob: this.blob, blobURL: this.blobURL });
      } else {
        this.stopPromise.reject({ message: "something went wrong" });
      }
    };
  }

  async recordStream(blobOption) {
    try {
      const mediaRecorder = new MediaRecorder(this.stream);
      this.mediaRecorder = mediaRecorder;
      this.onStreamConfiguration(blobOption);
      mediaRecorder.start();
    } catch (error) {
      console.log("MR class : Error in recording stream:", error);
      return { message: "Error in recording stream" };
    }
  }

  async stopStream() {
    try {
      this.mediaRecorder.stop();

      const tracks = this.stream.getTracks();
      tracks.forEach((track) => track.stop());

      this.stopPromise.promise = new Promise((resolve, reject) => {
        this.stopPromise.resolve = resolve;
        this.stopPromise.reject = reject;
      });

      return this.stopPromise.promise;
    } catch (error) {
      console.log("MR class : Error in stop stream:", error);
      return { message: "Error in stop stream" };
    }
  }

  async permissions(handlePermissions) {
    console.log("permission run");
    const permissionNames = [
      "camera",
      "microphone",
      // 'geolocation',
      // 'notifications',
      // 'push',
      // 'bluetooth',
      // 'midi',
      // 'clipboard-read',
      // 'clipboard-write',
      // 'background-sync',
      // 'payment-handler',
      // 'idle-detection',
    ];
    // state : prompt, granted, denied

    try {
      let finalPermission = {};
      await Promise.all(
        permissionNames.map(async (permission) => {
          const permissionStatus = await navigator.permissions.query({
            name: permission,
          });

          if ("onchange" in permissionStatus) {
            permissionStatus.onchange = (e) => {
              handlePermissions();
            };
          }

          finalPermission[permission] = permissionStatus;
        })
      );

      return finalPermission;
    } catch (error) {
      console.log("MR class : Error in checking permissions:", error);
      return { message: "Error in checking permissions" };
    }
  }

  async devices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      const uniqueKinds = Array.from(
        new Set(devices.map((device) => device.kind))
      );

      const categorizedDevices = uniqueKinds.reduce((acc, kind) => {
        const filteredDevices = devices.filter(
          (device) => device.kind === kind
        );
        acc[kind] = filteredDevices;
        return acc;
      }, {});

      return categorizedDevices;
    } catch (error) {
      console.log("MR class : Error in get devices:", error);
      return { message: "Error in get devices" };
    }
  }
}

export const MR = new MRClass();
