## canvas 性能优化

参考
https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas

## 来自 AI:
### **1. 减少绘制操作**
- **离屏渲染 (Offscreen Canvas)**  
  将重复绘制的图形（如背景、静态元素）缓存到离屏 Canvas 中，通过 `drawImage` 复用，避免重复计算和绘制。
  ```javascript
  const offscreen = new OffscreenCanvas(width, height);
  const ctxOffscreen = offscreen.getContext('2d');
  // 绘制到离屏 Canvas
  ctxOffscreen.fillRect(0, 0, 100, 100);
  // 主 Canvas 中复用
  ctx.drawImage(offscreen, 0, 0);
  ```

- **脏矩形算法 (Dirty Rectangle)**  
  仅重绘发生变化的区域，而非整个画布。记录需要更新的区域坐标，通过 `clearRect` 局部清除并重绘。

- **合并绘图操作**  
  批量处理路径绘制（如一次性绘制多个线条或形状），减少 `beginPath()` 和 `fill()`/`stroke()` 的调用次数。

---

### **2. 优化绘图 API**
- **避免频繁的状态变更**  
  减少 `strokeStyle`、`fillStyle`、`lineWidth` 等属性的动态修改，合并相同状态的绘制操作。
- **使用整数坐标**  
  非抗锯齿模式下，整数坐标 (`x.0, y.0`) 可以避免子像素渲染的计算开销。
- **简化复杂路径**  
  减少 `arc()` 和贝塞尔曲线的使用，用 `rect()` 或图像替代复杂形状。

---

### **3. 分辨率和缩放优化**
- **匹配物理分辨率**  
  根据设备像素比（`window.devicePixelRatio`）设置 Canvas 的实际宽高，避免模糊和性能损失：
  ```javascript
  const scale = window.devicePixelRatio;
  canvas.width = canvas.clientWidth * scale;
  canvas.height = canvas.clientHeight * scale;
  ctx.scale(scale, scale);
  ```
- **避免缩放变换**  
  频繁的 `ctx.scale()` 或 `ctx.transform()` 会降低性能，尽量在绘制时使用原始坐标。

---

### **4. 内存与对象管理**
- **对象池模式**  
  对频繁创建/销毁的对象（如粒子、图形实例）使用对象池，复用对象以减少垃圾回收（GC）压力。
- **避免内存泄漏**  
  及时移除不再使用的监听器，清理临时 Canvas 和图像资源。

---

### **5. 动画与渲染循环**
- **使用 `requestAnimationFrame`**  
  替代 `setInterval`/`setTimeout`，保持帧率与浏览器刷新率同步。
  ```javascript
  function animate() {
    // 更新逻辑
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
  ```
- **节流非关键渲染**  
  对低优先级任务（如日志、数据统计）使用 `setTimeout` 或 Web Workers，避免阻塞主线程。

---

### **6. 硬件加速与 WebGL**
- **启用 WebGL 渲染**  
  使用 `canvas.getContext('webgl')` 或 `webgl2` 上下文，利用 GPU 加速复杂图形。
- **CSS 3D 变换**  
  对 Canvas 容器应用 `transform: translateZ(0)`，触发 GPU 加速（慎用，可能增加内存）。

---

### **7. 性能分析工具**
- **Chrome DevTools**  
  使用 Performance 面板分析帧率、JS 堆栈和 GPU 负载，定位瓶颈。
- **Frame Timing API**  
  通过 `requestAnimationFrame` 的时间戳计算每帧耗时，监控性能。

---

### **8. 其他技巧**
- **禁用阴影和透明度**  
  减少 `shadowBlur`、`globalAlpha` 等耗性能的效果。
- **分层渲染**  
  将静态和动态内容分离到多个 Canvas 层，避免整体重绘。
- **Web Workers**  
  将计算密集型任务（如物理引擎）转移到 Web Workers，避免主线程阻塞。

---

通过上述策略，可以显著提升 Canvas 的渲染效率和流畅度。实际优化时需结合场景，通过工具分析针对性调整。


## 结合项目
1. 离屏渲染 Offscreen Canvas
2. canvas 分层, 多个 canvas
3. 批量更新 批量调用 API
4. 