/**
 * PicSort - Visual Sorting Algorithms
 * Modernized script with dynamic presets and educational features
 */

// --- Constants & Configuration ---

const PRESETS = [
    'presets/cyberpunk.png',
    'presets/gradient.png',
    'presets/nature.png'
];

const ALGORITHM_INFO = {
    insertion_sort: {
        name: "Insertion Sort",
        desc: "Builds the final sorted array one item at a time. It iterates through the input elements and grows a sorted array behind it.",
        time_best: "Ω(n)",
        time_avg: "θ(n^2)",
        time_worst: "O(n^2)",
        space: "O(1)",
        link: "https://www.geeksforgeeks.org/insertion-sort/"
    },
    selection_sort: {
        name: "Selection Sort",
        desc: "Repeatedly finds the minimum element from the unsorted part and puts it at the beginning.",
        time_best: "Ω(n^2)",
        time_avg: "θ(n^2)",
        time_worst: "O(n^2)",
        space: "O(1)",
        link: "https://www.geeksforgeeks.org/selection-sort/"
    },
    bubble_sort: {
        name: "Bubble Sort",
        desc: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
        time_best: "Ω(n)",
        time_avg: "θ(n^2)",
        time_worst: "O(n^2)",
        space: "O(1)",
        link: "https://www.geeksforgeeks.org/bubble-sort/"
    },
    quick_sort: {
        name: "Quick Sort",
        desc: "Picks an element as pivot and partitions the given array around the picked pivot.",
        time_best: "Ω(n log(n))",
        time_avg: "θ(n log(n))",
        time_worst: "O(n^2)",
        space: "O(log(n))",
        link: "https://www.geeksforgeeks.org/quick-sort/"
    },
    merge_sort: {
        name: "Merge Sort",
        desc: "Divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.",
        time_best: "Ω(n log(n))",
        time_avg: "θ(n log(n))",
        time_worst: "O(n log(n))",
        space: "O(n)",
        link: "https://www.geeksforgeeks.org/merge-sort/"
    },
    heap_sort: {
        name: "Heap Sort",
        desc: "Comparison-based sorting technique based on Binary Heap data structure.",
        time_best: "Ω(n log(n))",
        time_avg: "θ(n log(n))",
        time_worst: "O(n log(n))",
        space: "O(1)",
        link: "https://www.geeksforgeeks.org/heap-sort/"
    },
    shell_sort: {
        name: "Shell Sort",
        desc: "Variation of Insertion Sort. In the 'shell' sort, elements at a specific interval are sorted.",
        time_best: "Ω(n log(n))",
        time_avg: "θ(n(log(n))^2)",
        time_worst: "O(n(log(n))^2)",
        space: "O(1)",
        link: "https://www.geeksforgeeks.org/shell-sort/"
    },
    comb_sort: {
        name: "Comb Sort",
        desc: "Improves on Bubble Sort. Eliminates turtles, or small values near the end of the list.",
        time_best: "Ω(n log(n))",
        time_avg: "θ(n^2)",
        time_worst: "O(n^2)",
        space: "O(1)",
        link: "https://www.geeksforgeeks.org/comb-sort/"
    },
    cocktail_sort: {
        name: "Cocktail Sort",
        desc: "Variation of Bubble sort. The Bubble sort algorithm always traverses elements from left and moves the largest element to its correct position in first iteration and second largest in second iteration and so on.",
        time_best: "Ω(n)",
        time_avg: "θ(n^2)",
        time_worst: "O(n^2)",
        space: "O(1)",
        link: "https://www.geeksforgeeks.org/cocktail-sort/"
    },
    odd_even_sort: {
        name: "Odd-Even Sort",
        desc: "Variation of bubble sort. It proceeds by comparing all odd/even indexed pairs of adjacent elements in the list and, if a pair is in the wrong order the elements are switched.",
        time_best: "Ω(n)",
        time_avg: "θ(n^2)",
        time_worst: "O(n^2)",
        space: "O(1)",
        link: "https://www.geeksforgeeks.org/odd-even-sort-brick-sort/"
    }
};

// --- Global State ---
let app = null;
let currentImageSrc = PRESETS[0]; // Default to first preset

// --- Initialization ---

window.addEventListener('load', init);
window.addEventListener('resize', () => {
    if (app) app.resizeCanvas();
});

function init() {
    setupPresets();
    setupControls();
    updateAlgoInfo('insertion_sort'); // Default
    
    // Load default image
    loadImage(currentImageSrc);
}

function setupPresets() {
    const container = document.getElementById('presets-container');
    container.innerHTML = '';

    PRESETS.forEach(src => {
        const div = document.createElement('div');
        div.className = 'preset-item';
        if (src === currentImageSrc) div.classList.add('active');
        
        const img = document.createElement('img');
        img.src = src;
        img.alt = "Preset Image";
        
        div.appendChild(img);
        div.onclick = () => {
            document.querySelectorAll('.preset-item').forEach(el => el.classList.remove('active'));
            div.classList.add('active');
            currentImageSrc = src;
            loadImage(src);
        };
        
        container.appendChild(div);
    });
}

function setupControls() {
    // Algorithm Select
    const algoSelect = document.getElementById('algorithm');
    if (algoSelect) {
        algoSelect.addEventListener('change', (e) => {
            updateAlgoInfo(e.target.value);
            if (app) app.setAlgorithm(e.target.value);
        });
    }

    // Delay Slider
    const delayInput = document.getElementById('delay');
    const delayVal = document.getElementById('delay-val');
    if (delayInput && delayVal) {
        delayInput.addEventListener('input', (e) => {
            delayVal.textContent = e.target.value + 'ms';
            if (app) app.delay = parseInt(e.target.value);
        });
    }

    // Buttons
    const btnPlay = document.getElementById('btn-play');
    if (btnPlay) {
        btnPlay.addEventListener('click', () => {
            if (app) app.startSort();
        });
    }

    const btnReset = document.getElementById('btn-reset');
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            if (app) {
                app.reset();
                loadImage(currentImageSrc); // Reload clean image
            }
        });
    }

    // File Upload
    const fileInput = document.getElementById('input-file');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    currentImageSrc = event.target.result;
                    // Deselect presets
                    document.querySelectorAll('.preset-item').forEach(el => el.classList.remove('active'));
                    loadImage(currentImageSrc);
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }
}

function updateAlgoInfo(algoKey) {
    const info = ALGORITHM_INFO[algoKey];
    if (!info) return;

    const elTitle = document.getElementById('algo-title');
    const elDesc = document.getElementById('algo-desc');
    const elTimeBest = document.getElementById('time-best');
    const elTimeAvg = document.getElementById('time-avg');
    const elTimeWorst = document.getElementById('time-worst');
    const elSpace = document.getElementById('space-complexity');
    const elLink = document.getElementById('algo-link');

    if (elTitle) elTitle.textContent = info.name;
    if (elDesc) elDesc.textContent = info.desc;
    if (elTimeBest) elTimeBest.textContent = info.time_best;
    if (elTimeAvg) elTimeAvg.textContent = info.time_avg;
    if (elTimeWorst) elTimeWorst.textContent = info.time_worst;
    if (elSpace) elSpace.textContent = info.space;
    if (elLink) elLink.href = info.link;
}

function loadImage(src) {
    if (app) app.terminate();
    
    const canvas = document.getElementById('board');
    const algoSelect = document.getElementById('algorithm');
    const delayInput = document.getElementById('delay');
    
    if (!canvas || !algoSelect || !delayInput) return;

    const algorithm = algoSelect.value;
    const delay = parseInt(delayInput.value);
    
    app = new SortVisualization(canvas, src, algorithm, delay);
}

// --- SortVisualization Class ---

function SortVisualization(canvas, imgData, algorithm, delay) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    this.algorithm = algorithm;
    this.delay = delay;
    this.done = false;
    this.forceClear = false;
    this.ms = 1000 / 60;
    this.lastPaintTime = 0;
    
    this.setStatus('Loading Image...');
    
    this.img = new Image();
    this.img.src = imgData;
    this.img.onload = this.prepare.bind(this);
}

SortVisualization.prototype.setStatus = function(status) {
    const el = document.getElementById('status-text');
    if (el) el.textContent = status;
};

SortVisualization.prototype.setAlgorithm = function(algo) {
    this.algorithm = algo;
};

SortVisualization.prototype.resizeCanvas = function() {
    if (!this.img || !this.img.complete) return;

    const container = this.canvas.parentElement;
    const maxWidth = container.clientWidth - 40; // Padding
    const maxHeight = container.clientHeight - 40;

    const scale = Math.min(maxWidth / this.img.width, maxHeight / this.img.height);
    
    // Set display size
    this.canvas.style.width = (this.img.width * scale) + 'px';
    this.canvas.style.height = (this.img.height * scale) + 'px';
};

SortVisualization.prototype.prepare = function() {
    // Limit internal resolution for performance
    const MAX_DIM = 300;
    if (Math.max(this.img.width, this.img.height) > MAX_DIM) {
        const scale = MAX_DIM / Math.max(this.img.width, this.img.height);
        this.img.width *= scale;
        this.img.height *= scale;
    }

    this.canvas.width = this.img.width;
    this.canvas.height = this.img.height;
    
    this.resizeCanvas();
    
    this.ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height);
    this.imgData = this.ctx.getImageData(0, 0, this.img.width, this.img.height);
    this.imgDataArr = this.imgData.data;
    
    // Initialize sorting array (indices)
    this.arr = [];
    for (let i = 0; i < this.img.height; i++) {
        let innerArr = [];
        for (let j = 0; j < this.img.width; j++) {
            innerArr.push(j);
        }
        this.arr.push(innerArr);
    }

    this.setStatus('Ready to Sort');
    this.done = false;
    
    // Start paint loop
    requestAnimationFrame(this.paintLoop.bind(this));
};

SortVisualization.prototype.startSort = function() {
    if (this.done) {
        this.reset();
        // Need to wait for reset to finish? No, reset just clears flags.
        // But we need to reload the image to sort again? 
        // Actually, let's just shuffle then sort.
    }
    
    this.setStatus('Shuffling...');
    this.shuffle(2 * this.img.width);
};

SortVisualization.prototype.reset = function() {
    this.forceClear = true;
    this.terminate();
    this.setStatus('Resetting...');
};

SortVisualization.prototype.terminate = function() {
    this.done = true;
    this.setStatus('Done / Stopped');
};

SortVisualization.prototype.setTimeout = function(cb, timeout) {
    if (this.done) return;
    setTimeout(cb, timeout);
};

SortVisualization.prototype.paintLoop = function(timestamp) {
    if (this.forceClear) return; // Stop painting if cleared
    
    const delta = (timestamp - this.lastPaintTime) / 1000;
    this.display();
    
    if (!this.done) {
        requestAnimationFrame(this.paintLoop.bind(this));
    }
    this.lastPaintTime = timestamp;
};

SortVisualization.prototype.display = function() {
    this.ctx.putImageData(this.imgData, 0, 0);
};

SortVisualization.prototype.swap = function(k, i, j) {
    // Swap pixels in ImageData
    this.swapImgArr(i + k * this.img.width, j + k * this.img.width);
    
    // Swap logical indices
    const temp = this.arr[k][i];
    this.arr[k][i] = this.arr[k][j];
    this.arr[k][j] = temp;
};

SortVisualization.prototype.swapImgArr = function(i, j) {
    const idx1 = i * 4;
    const idx2 = j * 4;
    
    const r = this.imgDataArr[idx1];
    const g = this.imgDataArr[idx1 + 1];
    const b = this.imgDataArr[idx1 + 2];
    const a = this.imgDataArr[idx1 + 3];
    
    this.imgDataArr[idx1] = this.imgDataArr[idx2];
    this.imgDataArr[idx1 + 1] = this.imgDataArr[idx2 + 1];
    this.imgDataArr[idx1 + 2] = this.imgDataArr[idx2 + 2];
    this.imgDataArr[idx1 + 3] = this.imgDataArr[idx2 + 3];
    
    this.imgDataArr[idx2] = r;
    this.imgDataArr[idx2 + 1] = g;
    this.imgDataArr[idx2 + 2] = b;
    this.imgDataArr[idx2 + 3] = a;
};

SortVisualization.prototype.shuffle = function(amount) {
    let i = 0;
    const self = this;
    
    function step() {
        if (i >= amount) {
            self.setStatus('Sorting: ' + ALGORITHM_INFO[self.algorithm].name);
            self[self.algorithm]();
            return;
        }
        
        for (let j = 0; j < self.img.height; j++) {
            self.swap(j, roll(0, self.img.width - 1), roll(0, self.img.width - 1));
        }
        i++;
        self.setTimeout(step, 0);
    }
    step();
};

function roll(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

// --- Sorting Algorithms ---

SortVisualization.prototype.insertion_sort = function() {
    let i = 0;
    let js = new Array(this.img.height).fill(-1);
    const self = this;
    
    function step() {
        for (let l = 0; l < 20; l++) { // Batch updates for speed
            if (i >= self.img.width) {
                self.terminate();
                return;
            }
            
            let rowDone = true;
            for (let k = 0; k < self.img.height; k++) {
                if (js[k] >= 0 && (self.arr[k][js[k]] > self.arr[k][js[k] + 1])) {
                    self.swap(k, js[k], js[k] + 1);
                    js[k]--;
                    rowDone = false;
                }
            }
            
            if (rowDone) {
                i++;
                for (let k = 0; k < self.img.height; k++) {
                    js[k] = i - 1;
                }
            }
        }
        self.setTimeout(step, self.delay);
    }
    step();
};

SortVisualization.prototype.selection_sort = function() {
    let i = 0;
    const self = this;
    
    function step() {
        if (i >= self.img.width) {
            self.terminate();
            return;
        }
        
        for (let k = 0; k < self.img.height; k++) {
            let min = i;
            for (let j = i + 1; j < self.img.width; j++) {
                if (self.arr[k][j] < self.arr[k][min]) {
                    min = j;
                }
            }
            if (min != i) {
                self.swap(k, min, i);
            }
        }
        i++;
        self.setTimeout(step, self.delay);
    }
    step();
};

SortVisualization.prototype.bubble_sort = function() {
    let i = 0;
    const self = this;
    let swapped = true;
    
    function step() {
        if (i >= self.img.width || !swapped) {
            self.terminate();
            return;
        }
        
        swapped = false;
        for (let k = 0; k < self.img.height; k++) {
            for (let j = 0; j < self.img.width - 1 - i; j++) {
                if (self.arr[k][j] > self.arr[k][j + 1]) {
                    self.swap(k, j, j + 1);
                    swapped = true;
                }
            }
        }
        i++;
        self.setTimeout(step, self.delay);
    }
    step();
};

SortVisualization.prototype.quick_sort = function() {
    const self = this;
    const stacks = [];
    const tops = [];
    
    for (let k = 0; k < self.img.height; k++) {
        tops.push(-1);
        stacks.push([]);
        stacks[k][++tops[k]] = 0;
        stacks[k][++tops[k]] = self.arr[0].length - 1;
    }
    
    function step() {
        let shouldTerminate = true;
        for (let k = 0; k < self.img.height; k++) {
            if (tops[k] >= 0) shouldTerminate = false;
        }
        
        if (shouldTerminate) {
            self.terminate();
            return;
        }
        
        for (let k = 0; k < self.img.height; k++) {
            if (tops[k] < 0) continue;
            
            const high = stacks[k][tops[k]--];
            const low = stacks[k][tops[k]--];
            
            const pivot = self.arr[k][high];
            let i = low - 1;
            
            for (let j = low; j <= high - 1; j++) {
                if (self.arr[k][j] <= pivot) {
                    i++;
                    self.swap(k, i, j);
                }
            }
            self.swap(k, i + 1, high);
            
            const p = i + 1;
            
            if (p + 1 < high) {
                stacks[k][++tops[k]] = p + 1;
                stacks[k][++tops[k]] = high;
            }
            if (p - 1 > low) {
                stacks[k][++tops[k]] = low;
                stacks[k][++tops[k]] = p - 1;
            }
        }
        self.setTimeout(step, self.delay);
    }
    step();
};

SortVisualization.prototype.merge_sort = function() {
    const self = this;
    let currSize = 1;
    let leftStart = 0;
    let auxArr = [];
    let merging = false;
    
    let mergePtrs = [];
    let leftPtrs = [];
    let rightPtrs = [];
    let leftLen = 0;
    
    function merge() {
        // Check if current merge step is done for all rows
        if ((leftPtrs[0] >= leftLen || leftPtrs[0] >= auxArr[0].length) && rightPtrs[0] >= auxArr[0].length) {
            merging = false;
            return;
        }
        
        for (let k = 0; k < self.img.height; k++) {
            // Safety checks
            if (!auxArr[k]) continue;
            
            if (leftPtrs[k] >= leftLen) {
                if (rightPtrs[k] < auxArr[k].length) {
                    copyFromAux(k, mergePtrs[k], rightPtrs[k]);
                    rightPtrs[k]++;
                    mergePtrs[k]++;
                }
            } else if (rightPtrs[k] >= auxArr[k].length) {
                if (leftPtrs[k] < auxArr[k].length) {
                    copyFromAux(k, mergePtrs[k], leftPtrs[k]);
                    leftPtrs[k]++;
                    mergePtrs[k]++;
                }
            } else if (auxArr[k][leftPtrs[k]].val < auxArr[k][rightPtrs[k]].val) {
                copyFromAux(k, mergePtrs[k], leftPtrs[k]);
                leftPtrs[k]++;
                mergePtrs[k]++;
            } else {
                copyFromAux(k, mergePtrs[k], rightPtrs[k]);
                rightPtrs[k]++;
                mergePtrs[k]++;
            }
        }
    }
    
    function copyFromAux(k, destIdx, srcIdx) {
        const item = auxArr[k][srcIdx];
        self.arr[k][destIdx] = item.val;
        
        const pixelIdx = (k * self.img.width + destIdx) * 4;
        self.imgDataArr[pixelIdx] = item.r;
        self.imgDataArr[pixelIdx + 1] = item.g;
        self.imgDataArr[pixelIdx + 2] = item.b;
        self.imgDataArr[pixelIdx + 3] = item.a;
    }
    
    function step() {
        for (let l = 0; l < 4; l++) { // Batch size
            if (currSize >= self.img.width) {
                self.terminate();
                return;
            }
            
            if (merging) {
                merge();
            } else {
                if (leftStart >= self.img.width - 1) {
                    leftStart = 0;
                    currSize *= 2;
                }
                
                mergePtrs = [];
                auxArr = [];
                leftLen = currSize;
                
                for (let k = 0; k < self.img.height; k++) {
                    auxArr.push([]);
                    mergePtrs.push(leftStart);
                    
                    for (let i = 0; i < currSize * 2 && mergePtrs[k] + i < self.img.width; i++) {
                        const idx = mergePtrs[k] + i;
                        const pixelIdx = (k * self.img.width + idx) * 4;
                        
                        auxArr[k].push({
                            val: self.arr[k][idx],
                            r: self.imgDataArr[pixelIdx],
                            g: self.imgDataArr[pixelIdx + 1],
                            b: self.imgDataArr[pixelIdx + 2],
                            a: self.imgDataArr[pixelIdx + 3]
                        });
                    }
                    leftPtrs[k] = 0;
                    rightPtrs[k] = currSize;
                }
                leftStart += 2 * currSize;
                merging = true;
            }
        }
        self.setTimeout(step, self.delay);
    }
    step();
};

SortVisualization.prototype.heap_sort = function() {
    let i = Math.floor(this.img.width / 2);
    const self = this;
    
    buildHeap();
    
    function buildHeap() {
        if (i < 0) {
            i = self.img.width - 1;
            sortHeap();
            return;
        }
        for (let k = 0; k < self.img.height; k++) {
            heapify(k, i, self.img.width);
        }
        i--;
        self.setTimeout(buildHeap, self.delay);
    }
    
    function sortHeap() {
        if (i < 1) {
            self.terminate();
            return;
        }
        for (let k = 0; k < self.img.height; k++) {
            self.swap(k, 0, i);
            heapify(k, 0, i);
        }
        i--;
        self.setTimeout(sortHeap, self.delay);
    }
    
    function heapify(k, idx, size) {
        let left = idx * 2 + 1;
        let right = idx * 2 + 2;
        let largest = idx;
        
        if (left < size && self.arr[k][left] > self.arr[k][largest]) {
            largest = left;
        }
        if (right < size && self.arr[k][right] > self.arr[k][largest]) {
            largest = right;
        }
        
        if (largest != idx) {
            self.swap(k, idx, largest);
            heapify(k, largest, size);
        }
    }
};

SortVisualization.prototype.shell_sort = function() {
    let h = 1;
    while (h < this.img.width / 3) {
        h = 3 * h + 1;
    }
    let i = h;
    const self = this;
    
    function step() {
        if (i >= self.img.width) {
            if (h < 1) {
                self.terminate();
                return;
            }
            h = Math.round(h / 3);
            i = h;
        }
        
        for (let k = 0; k < self.img.height; k++) {
            for (let j = i; j >= h && (self.arr[k][j] < self.arr[k][j - h]); j -= h) {
                self.swap(k, j, j - h);
            }
        }
        i++;
        self.setTimeout(step, self.delay);
    }
    step();
};

SortVisualization.prototype.comb_sort = function() {
    let gap = this.img.width;
    const shrinkFactor = 1.3;
    const self = this;
    let sorted = false;
    let j = 0;
    let firstTime = true;
    
    function step() {
        for (let l = 0; l < 3; l++) {
            if (firstTime || j + gap >= self.img.width) {
                if (sorted) {
                    self.terminate();
                    return;
                }
                firstTime = false;
                j = 0;
                gap = Math.floor(gap / shrinkFactor);
                if (gap > 1) {
                    sorted = false;
                } else {
                    gap = 1;
                    sorted = true;
                }
            }
            
            for (let k = 0; k < self.img.height; k++) {
                if (j + gap < self.img.width) {
                    if (self.arr[k][j] > self.arr[k][j + gap]) {
                        self.swap(k, j, j + gap);
                        sorted = false;
                    }
                }
            }
            j++;
        }
        self.setTimeout(step, self.delay);
    }
    step();
};

SortVisualization.prototype.cocktail_sort = function() {
    let i = 0;
    const self = this;
    let direction = true;
    let swapped = true;
    
    function step() {
        if (i >= self.img.width || !swapped) {
            self.terminate();
            return;
        }
        
        swapped = false;
        for (let k = 0; k < self.img.height; k++) {
            if (direction) {
                for (let j = 0; j < self.img.width - 1; j++) {
                    if (self.arr[k][j] > self.arr[k][j + 1]) {
                        self.swap(k, j, j + 1);
                        swapped = true;
                    }
                }
            } else {
                for (let j = self.img.width - 2; j >= 0; j--) {
                    if (self.arr[k][j] > self.arr[k][j + 1]) {
                        self.swap(k, j, j + 1);
                        swapped = true;
                    }
                }
            }
        }
        direction = !direction;
        i++;
        self.setTimeout(step, self.delay);
    }
    step();
};

SortVisualization.prototype.odd_even_sort = function() {
    let i = 0;
    const self = this;
    let swapped = true;
    
    function step() {
        if (i >= self.img.width || !swapped) {
            self.terminate();
            return;
        }
        
        swapped = false;
        for (let k = 0; k < self.img.height; k++) {
            for (let j = 1; j < self.img.width - 1; j += 2) {
                if (self.arr[k][j] > self.arr[k][j + 1]) {
                    self.swap(k, j, j + 1);
                    swapped = true;
                }
            }
            for (let j = 0; j < self.img.width - 1; j += 2) {
                if (self.arr[k][j] > self.arr[k][j + 1]) {
                    self.swap(k, j, j + 1);
                    swapped = true;
                }
            }
        }
        i++;
        self.setTimeout(step, self.delay);
    }
    step();
};