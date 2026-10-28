export default {
    props: ['timeData'],
    data: {
        temperatures: [],
        timeLabels: [],
        canvasContext: null,
        chartWidth: 0,
        chartHeight: 0,
        refreshTimer: null,
        retryCount: 0
    },
    
    onInit() {
        this.processData();
        this.$watch('timeData', 'processData');
    },
    
    onReady() {
        // 组件准备完成后初始化Canvas
        this.initCanvas();
        // 启动定时刷新，每3秒尝试重绘
        this.startRefreshTimer();
    },
    
    onDestroy() {
        // 组件销毁时清除定时器
        this.stopRefreshTimer();
    },
    
    startRefreshTimer() {
        // 清除旧定时器
        this.stopRefreshTimer();
        
        // 设置定时器，每3秒检查一次
        this.refreshTimer = setInterval(() => {
            if (!this.canvasContext && this.retryCount < 10) {
                // 如果Canvas还未初始化，尝试重新初始化
                console.log('temperatureChart: retry init canvas, attempt ' + (this.retryCount + 1));
                this.initCanvas();
                this.retryCount++;
            } else if (this.canvasContext && this.temperatures.length > 0) {
                // Canvas已初始化且有数据，重绘图表
                this.drawChartInternal();
            }
        }, 3000);
    },
    
    stopRefreshTimer() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
        }
    },
    
    initCanvas() {
        // 获取Canvas元素并初始化绘图上下文
        const canvasRef = this.$element('tempChart');
        if (canvasRef) {
            try {
                this.canvasContext = canvasRef.getContext('2d');
                // 设置Canvas尺寸
                this.chartWidth = canvasRef.width || 600;
                this.chartHeight = canvasRef.height || 200;
                
                console.log('temperatureChart: canvas initialized, width=' + this.chartWidth + ', height=' + this.chartHeight);
                
                // 如果数据已准备好，则绘制图表
                if (this.temperatures.length > 0) {
                    this.drawChartInternal();
                }
                
                // 初始化成功，重置重试计数
                this.retryCount = 0;
            } catch (e) {
                console.error('temperatureChart: init canvas failed', e);
            }
        } else {
            console.warn('temperatureChart: canvas element not found');
        }
    },
    
    processData() {
        // 确保 timeData 存在且有效
        if (!this.timeData || !Array.isArray(this.timeData) || this.timeData.length === 0) {
            console.warn('temperatureChart: timeData is invalid');
            return;
        }
        
        this.temperatures = [];
        this.timeLabels = []; // 存储时间标签
        
        // 处理24小时数据
        for (let i = 0; i < this.timeData.length; i++) {
            const item = this.timeData[i];
            if (!item || !item.data_time || !item.temp_fc) {
                continue;
            }
            
            // 解析温度
            const temp = parseInt(item.temp_fc);
            if (isNaN(temp)) {
                continue;
            }
            
            this.temperatures.push(temp);
            
            // 解析时间
            let timeStr = item.data_time;
            let hour = '';
            
            if (timeStr.includes(' ')) {
                // 格式: "2023-01-02 23:00:00"
                let parts = timeStr.split(' ');
                if (parts.length > 1) {
                    let timeParts = parts[1].split(':');
                    hour = timeParts[0] + ':' + timeParts[1];
                }
            } else if (timeStr.includes(':')) {
                // 格式: "23:00"
                let parts = timeStr.split(':');
                hour = parts[0] + ':' + parts[1];
            }
            
            this.timeLabels.push(hour);
        }
        
        // 数据处理完成后，尝试绘制图表
        if (this.canvasContext) {
            this.drawChartInternal();
        } else {
            // Canvas可能还未初始化，多次尝试
            let retryAttempt = 0;
            const retryInit = () => {
                if (!this.canvasContext && retryAttempt < 3) {
                    retryAttempt++;
                    setTimeout(() => {
                        this.initCanvas();
                        if (!this.canvasContext) {
                            retryInit();
                        }
                    }, 100 * retryAttempt); // 100ms, 200ms, 300ms
                }
            };
            retryInit();
        }
    },

    
    drawChartInternal() {
        if (!this.canvasContext || this.temperatures.length === 0) {
            console.warn('temperatureChart: cannot draw, context=' + !!this.canvasContext + ', data length=' + this.temperatures.length);
            return;
        }
        
        try {
            const ctx = this.canvasContext;
            const width = this.chartWidth;
            const height = this.chartHeight;
            
            // 清空画布
            ctx.clearRect(0, 0, width, height);
        
        // 计算温度范围
        const temps = this.temperatures;
        const minTemp = Math.min(...temps);
        const maxTemp = Math.max(...temps);
        const tempRange = maxTemp - minTemp || 10; // 避免除以0
        const padding = Math.max(tempRange * 0.2, 2); // 至少2度的padding
        
        // 绘制参数
        const leftPadding = 25;
        const rightPadding = 25;
        const topPadding = 35;
        const bottomPadding = 35;
        const chartWidth = width - leftPadding - rightPadding;
        const chartHeight = height - topPadding - bottomPadding;
        
        // 计算坐标点
        const points = [];
        const stepX = temps.length > 1 ? chartWidth / (temps.length - 1) : chartWidth / 2;
        
        for (let i = 0; i < temps.length; i++) {
            const x = leftPadding + i * stepX;
            // 归一化温度到画布高度
            const normalizedTemp = (temps[i] - minTemp + padding) / (tempRange + padding * 2);
            const y = topPadding + chartHeight * (1 - normalizedTemp);
            points.push({ x, y, temp: temps[i] });
        }
        
        // 绘制背景网格线
        ctx.strokeStyle = 'rgba(200, 200, 200, 0.15)';
        ctx.lineWidth = 1;
        
        const gridLines = 3;
        for (let i = 0; i <= gridLines; i++) {
            const y = topPadding + (chartHeight / gridLines) * i;
            ctx.beginPath();
            ctx.moveTo(leftPadding, y);
            ctx.lineTo(leftPadding + chartWidth, y);
            ctx.stroke();
        }
        
        // 绘制渐变填充区域
        if (points.length > 1) {
            const gradient = ctx.createLinearGradient(0, topPadding, 0, topPadding + chartHeight);
            gradient.addColorStop(0, 'rgba(255, 140, 80, 0.2)');
            gradient.addColorStop(1, 'rgba(100, 180, 255, 0.15)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(points[0].x, topPadding + chartHeight);
            ctx.lineTo(points[0].x, points[0].y);
            
            // 使用三次贝塞尔曲线，控制点在两点中间，避免多余波动
            for (let i = 0; i < points.length - 1; i++) {
                const p1 = points[i];
                const p2 = points[i + 1];
                
                // 控制点位于两点连线的1/3和2/3处，垂直方向保持各自高度
                const cp1x = p1.x + (p2.x - p1.x) / 3;
                const cp1y = p1.y;
                const cp2x = p1.x + (p2.x - p1.x) * 2 / 3;
                const cp2y = p2.y;
                
                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
            }
            
            ctx.lineTo(points[points.length - 1].x, topPadding + chartHeight);
            ctx.closePath();
            ctx.fill();
        }
        
        // 绘制温度曲线 - 使用三次贝塞尔曲线，两点之间直接平滑过渡
        ctx.strokeStyle = '#FF6B35';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        if (points.length > 0) {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            
            // 使用三次贝塞尔曲线，控制点在两点之间，避免过度波动
            for (let i = 0; i < points.length - 1; i++) {
                const p1 = points[i];
                const p2 = points[i + 1];
                
                // 控制点位于两点连线的1/3和2/3处，垂直方向保持各自高度
                // 这样确保曲线只在两点之间平滑过渡，不会产生多余波动
                const cp1x = p1.x + (p2.x - p1.x) / 3;
                const cp1y = p1.y;
                const cp2x = p1.x + (p2.x - p1.x) * 2 / 3;
                const cp2y = p2.y;
                
                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
            }
            
            ctx.stroke();
        }
        
        // 绘制数据点、温度和时间标签
        ctx.textAlign = 'center';
        
        for (let i = 0; i < points.length; i++) {
            // 每4个点或首尾绘制标记
            if (i % 4 === 0 || i === points.length - 1) {
                // 绘制外圈白色圆点
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(points[i].x, points[i].y, 5, 0, 2 * Math.PI);
                ctx.fill();
                
                // 绘制内圈橙色圆点
                ctx.fillStyle = '#FF6B35';
                ctx.beginPath();
                ctx.arc(points[i].x, points[i].y, 3, 0, 2 * Math.PI);
                ctx.fill();
                
                // 绘制温度文字（在圆点上方）- 加大字体
                ctx.fillStyle = '#333333';
                ctx.font = 'bold 14px sans-serif';
                ctx.textBaseline = 'bottom';
                ctx.fillText(points[i].temp + '°', points[i].x, points[i].y - 10);
                
                // 绘制时间文字（在圆点下方）- 加大字体
                if (this.timeLabels && this.timeLabels[i]) {
                    ctx.fillStyle = '#888888';
                    ctx.font = '12px sans-serif';
                    ctx.textBaseline = 'top';
                    ctx.fillText(this.timeLabels[i], points[i].x, points[i].y + 10);
                }
            }
        }
        
        console.log('temperatureChart: draw complete');
        } catch (e) {
            console.error('temperatureChart: draw error', e);
        }
    }
};
