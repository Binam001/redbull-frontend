import * as THREE from "three";

if (typeof window !== "undefined") {
  // Suppress the THREE.Clock deprecation notice caused by React Three Fiber's internal store
  THREE.setConsoleFunction((type: string, message: string, ...params: unknown[]) => {
    if (
      typeof message === "string" &&
      message.includes("Clock: This module has been deprecated")
    ) {
      return;
    }
    if (type === "warn") {
      console.warn(message, ...params);
    } else if (type === "error") {
      console.error(message, ...params);
    } else {
      console.log(message, ...params);
    }
  });
}
