<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="description" content="gpu.js - playground. Run and benchmark demos for gpu.js - is a single-file JavaScript library for GPGPU in the browser. gpu.js will automatically compile specially written JavaScript functions into shader language and run them on the GPU using the WebGL API. In the case where WebGL is not available, the functions will still run in regular JavaScript." />

		<meta property="og:title" content="gpu.js - playground : GPU Accelerated JavaScript" />
		<meta property="og:type" content="website" />
		<meta property="og:url" content="http://gpu.rocks/" />
		<meta property="og:image" content="http://gpu.rocks/img/ogimage.png" />
		
		<title>gpu.js - playground : GPU Accelerated JavaScript</title>
		<link rel="icon" href="img/jelly.png">
		
		<!-- jquery + bootstrap -->
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.js"></script>
		<link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.css" rel="stylesheet">
		<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.js"></script>
		
		<!-- code mirror -->
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.13.4/codemirror.css">
		<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.13.4/codemirror.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.13.4/mode/javascript/javascript.js"></script>
		
		<!-- seed random : https://github.com/davidbau/seedrandom -->
		<script src="https://cdnjs.cloudflare.com/ajax/libs/seedrandom/2.4.0/lib/xor4096.min.js"></script>
		
		<!-- chartist -->
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/chartist/0.9.7/chartist.min.css">
		<script src="https://cdnjs.cloudflare.com/ajax/libs/chartist/0.9.7/chartist.js"></script>
		
		<!-- gpu.js scripts -->
		<script src="../bin/gpu.js"></script>


		<script language="JavaScript">
      	 var gpu = new GPU();
         $('document').ready ( function () {


             // Create the GPU accelerated function
             var mat_mult = gpu.createKernel(function(A, B) {
                 var sum = 0;
                 for (var i=0; i<512; i++) {
                     sum += A[this.thread.y][i] * B[i][this.thread.x];
                 }
                 return sum;
             }).dimensions([512, 512]);
             
             // Perform matrix multiplication on 2 matrices of size 512 x 512
             var C = mat_mult(A, B);

             var render = gpu.createKernel(function() {

                 var j =0;
                 var zr = 0.0;
                 var zi = 0.0;
                 var maxiter = 4000;
                 var zr2 = 0.0;
                 var zi2 = 0.0;
                 var newzr = 0.0;
                 var myx = ((this.thread.x +4400.0) / 16400.0);
                 var myy = ((this.thread.y - 500.0) / 16400.0);
                 for (var i = 0; i < maxiter; i++) {
                     if (( zr2 + zi2) < 4) {
                       //3+5i  sqared = 9 -25 + 15i
                         newzr = zr2 - zi2 + myx;
                         zi =  2 * zr * zi + myy ;
                         zr = newzr;
                         zr2 = zr * zr;
                         zi2 = zi * zi;
                         
                         j++;
                     } 
                 }
                 if (j > maxiter-3) 
                 {
                     this.color(0,0,0,0);
                 } else {
                     this.color((j%256)/256,(j%64)/64,(j%16)/16,0);
                 }
                                     
             }).dimensions([1000, 1000]).graphical(true).loopMaxIterations(20000).mode('gpu');
    
             render();

             var canvas = render.getCanvas();
             document.getElementById('mycanvas').appendChild(canvas);
         });


        </script>

		<link rel="stylesheet" href="playground.css">
	</head>
	<body>
		<a href="https://github.com/louisroehrs/gpu.js" class="github-corner"><svg width="80" height="80" viewBox="0 0 250 250" style="fill: rgba(21, 21, 19, 0.53); color:#fff; position: absolute; top: 0; border: 0; right: 0;"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a>
		<div class="container">
			<div class="page-header">
				<h1>GPU.js - playground : <small style="display:inline-block">GPU Accelerated JavaScript</small></h1>
			</div>
		</div>
		<div id="mycanvas" class="container">

		</div>
<!--		<div class="container">
			<div class="col-sm-4">
				<label class="control-label" for="arg_count">Number of parameters</label>  
				<div class="input-group">
					<span class="input-group-btn">
						<button type="button" class="btn btn-default btn-number" data-type="minus" data-field="arg_count">
							<span class="glyphicon glyphicon-minus"></span>
						</button>
					</span>
					<input type="text" name="arg_count" id="arg_count" class="form-control input-number" value="2" min="0" max="10">
					<span class="input-group-btn">
						<button type="button" class="btn btn-default btn-number" data-type="plus" data-field="arg_count">
							<span class="glyphicon glyphicon-plus"></span>
						</button>
					</span>
				</div>
			</div>
			<div class="col-sm-4">
				<label class="control-label" for="sample_size">Sample size</label>  
				<div class="input-group">
					<span class="input-group-btn">
						<button type="button" class="btn btn-default btn-number" data-type="minus" data-field="sample_size">
							<span class="glyphicon glyphicon-minus"></span>
						</button>
					</span>
					<input type="text" name="sample_size" id="sample_size" class="form-control input-number" value="10" min="0" max="1000">
					<span class="input-group-btn">
						<button type="button" class="btn btn-default btn-number" data-type="plus" data-field="sample_size">
							<span class="glyphicon glyphicon-plus"></span>
						</button>
					</span>
				</div>
			</div>
			<div class="col-sm-4">
				<label class="control-label" for="rand_seed">Seed for Random</label>  
				<div class="form-group">
					<input type="text" name="rand_seed" id="rand_seed" class="form-control" value="random">
				</div>
			</div>
		</div>
		<div class="container paramContainer">
			<div class="paramGroupContainer" id="paramGroupContainer">
				<div class="col-sm-6 paramGroup sampleSet" id="paramGroupTemplate" style="display:none;">
					<div class="paramGroupInner sampleSetInner form-group">
						<label class="control-label" for="param_name">Parameter Name</label>  
						<input type="text" name="param_name" class="param_name form-control" value="A">
						<label class="control-label" for="param_function">Parameter Function</label>  
						<textarea name="param_function" class="param_function"></textarea>
						<label class="control-label" for="param_sample">Sample Output</label>  
						<pre class="param_sample"></pre>
					</div>
				</div>
			</div>
			<div class="col-sm-12 dim_group sampleSet" id="dim_group">
				<div class="sampleSetInner form-group">
					<label class="control-label" for="dim_function">Dimension Function</label>  
					<textarea name="dim_function" class="dim_function" id="dim_function"></textarea>
					<label class="control-label" for="dim_sample">Sample Dimensions</label>  
					<pre class="dim_sample sample_output" id="dim_sample"></pre>
				</div>
			</div>
			<button id="paramset_btn" type="button" class="btn btn-primary btn-lg btn-block paramset_btn">Generate parameter samples</button>
		</div>
		<div class="container">
			<h3>Step 2) Program your kernel function</h3>
			<blockquote>
				Code out the kernel, do note the following tips.
				<br/>
				<br/>
				- Parameter functions is automatically called to provide args<br/>
				- if/else is expensive in GPU, if/else in loops is even more expensive
			</blockquote>
		</div>
		<div class="container kernelContainer">
			<div class="kernelGroupInner form-group">
				<label class="control-label" for="param_function">Kernel Function</label><br/>
				<textarea name="kernel_function" class="kernel_function" id="kernel_function"></textarea>
				<button id="kernel_sample_btn" type="button" class="btn btn-primary btn-lg btn-block kernel_sample_btn">Generate kernel sample</button>
				<label class="control-label" for="kernel_sample">Sample Output</label>
				<pre id="kernel_sample" name="kernel_sample" class="kernel_sample"></pre>
			</div>
		</div>
		<div class="container">
			<h3>Step 3) BENCH! CPU vs GPU</h3>
			<blockquote>
				Setup your sample size upper, lower bounds. Its increment size. Benchmark iterations. And bench it!<br/><br/>
				Generally speaking however, these are common learning notes.<br/><br/>
				- Due to the non-negligable overhead of running the webgl engine, small data sample sizes (such as <= 250) tends to be slower on GPU. Cut off point varies between kernel and machines<br/>
				<br/>
				- There is a small data transfer cost, to move from JS to GPU, paid by the CPU. Which is propotional to the data size. As such extremely simple kernel (such as A+B) will always be slower in GPU<br/>
			</blockquote>
		</div>
		<div class="container">
			<div class="col-sm-4">
				<label class="control-label" for="bench_lower">Lower bounds</label>  
				<div class="input-group">
					<span class="input-group-btn">
						<button type="button" class="btn btn-default btn-number" data-type="minus" data-field="bench_lower">
							<span class="glyphicon glyphicon-minus"></span>
						</button>
					</span>
					<input type="text" name="bench_lower" id="bench_lower" class="form-control input-number" value="50" min="0" max="4294967295">
					<span class="input-group-btn">
						<button type="button" class="btn btn-default btn-number" data-type="plus" data-field="bench_lower">
							<span class="glyphicon glyphicon-plus"></span>
						</button>
					</span>
				</div>
			</div>
			<div class="col-sm-4">
				<label class="control-label" for="bench_upper">Upper bounds</label>  
				<div class="input-group">
					<span class="input-group-btn">
						<button type="button" class="btn btn-default btn-number" data-type="minus" data-field="bench_upper">
							<span class="glyphicon glyphicon-minus"></span>
						</button>
					</span>
					<input type="text" name="bench_upper" id="bench_upper" class="form-control input-number" value="1500" min="0" max="4294967295">
					<span class="input-group-btn">
						<button type="button" class="btn btn-default btn-number" data-type="plus" data-field="bench_upper">
							<span class="glyphicon glyphicon-plus"></span>
						</button>
					</span>
				</div>
			</div>
			<div class="col-sm-4">
				<label class="control-label" for="bench_increment">Increment size</label>  
				<div class="input-group">
					<span class="input-group-btn">
						<button type="button" class="btn btn-default btn-number" data-type="minus" data-field="bench_increment">
							<span class="glyphicon glyphicon-minus"></span>
						</button>
					</span>
					<input type="text" name="bench_increment" id="bench_increment" class="form-control input-number" value="50" min="0" max="4294967295">
					<span class="input-group-btn">
						<button type="button" class="btn btn-default btn-number" data-type="plus" data-field="bench_increment">
							<span class="glyphicon glyphicon-plus"></span>
						</button>
					</span>
				</div>
			</div>
			<div class="col-sm-4">
				<label class="control-label" for="arg_count">Bench Size</label>  
				<div class="input-group">
					<span class="input-group-btn">
						<button type="button" class="btn btn-default btn-number" data-type="minus" data-field="bench_size">
							<span class="glyphicon glyphicon-minus"></span>
						</button>
					</span>
					<input type="text" name="bench_size" id="bench_size" class="form-control input-number" value="25" min="0" max="4294967295">
					<span class="input-group-btn">
						<button type="button" class="btn btn-default btn-number" data-type="plus" data-field="bench_size">
							<span class="glyphicon glyphicon-plus"></span>
						</button>
					</span>
				</div>
			</div>
			<div class="col-sm-4">
				<label class="control-label" for="arg_count">Warmup Size</label>  
				<div class="input-group">
					<span class="input-group-btn">
						<button type="button" class="btn btn-default btn-number" data-type="minus" data-field="warmup_size">
							<span class="glyphicon glyphicon-minus"></span>
						</button>
					</span>
					<input type="text" name="bench_size" id="warmup_size" class="form-control input-number" value="5" min="0" max="4294967295">
					<span class="input-group-btn">
						<button type="button" class="btn btn-default btn-number" data-type="plus" data-field="warmup_size">
							<span class="glyphicon glyphicon-plus"></span>
						</button>
					</span>
				</div>
			</div>
		</div>
		<div class="container chartContainer">
			<button id="bench_btn" type="button" class="btn btn-primary btn-lg btn-block bench_btn">Run the benchmark!</button>
			<h4>Average Time taken</h4>
			<div id="chart_time" class="chart_time bench_chart"></div>
			<h4>GPU Performance improvement</h4>
			<div id="chart_gain" class="chart_gain bench_chart"></div>
		</div>

-->
		<br/>
	</body>
</html>
