document.addEventListener("DOMContentLoaded", function() {
		
	/* work with settings start */

	if(window.location.search.substring(1)=='clear') {
		localStorage.clear('env');
		localStorage.clear('serviceToken');
		window.history.pushState("", "", '/');
	}

	/**
	 * возвращает cookie если есть или undefined
	 * @param  {[type]} name название cookie
	 * @return {[type]}      [description]
	 */
	function getCookie(name) {
		var matches = document.cookie.match(new RegExp(
			"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		))
		return matches ? decodeURIComponent(matches[1]) : undefined
	}

	/**
	 * уcтанавливает cookie
	 * @param {[type]} name  название cookie
	 * @param {String} value значение cookie (строка)
	 * @param {[type]} props Объект с дополнительными свойствами для установки cookie:
	 *                       expires
	 *                       	Время истечения cookie. Интерпретируется по-разному, 
	 *                       	в зависимости от типа:
	 *                        	Если число - количество секунд до истечения.
	 *                         	Если объект типа Date - точная дата истечения.
	 *                          Если expires в прошлом, то cookie будет удалено.
	 *                          Если expires отсутствует или равно 0, то cookie будет 
	 *                          установлено как сессионное и исчезнет при закрытии браузера.
	 *                       path
	 *                       	Путь для cookie.
	 *                       domain
	 *                       	Домен для cookie.
	 *                       secure
	 *                       	Пересылать cookie только по защищенному соединению.
	 */
	function setCookie(name, value, props) {
		props = props || {}
		var exp = props.expires
		if (typeof exp == "number" && exp) {
			var d = new Date()
			d.setTime(d.getTime() + exp*1000)
			exp = props.expires = d
		}
		if(exp && exp.toUTCString) { props.expires = exp.toUTCString() }
		value = encodeURIComponent(value)
		var updatedCookie = name + "=" + value
		for(var propName in props){
			updatedCookie += "; " + propName
			var propValue = props[propName]
			if(propValue !== true){ updatedCookie += "=" + propValue }
		}
		document.cookie = updatedCookie
	}

	/**
	 * удаляет cookie
	 * @param  {[type]} name название cookie
	 * @return {[type]}      [description]
	 */
	function deleteCookie(name) {
		setCookie(name, null, { expires: -1 })
	}

	if(localStorage.env === undefined || localStorage.env === 'null') {
		localStorage.env = prompt('Please enter env:', 'test');
	}
	console.log('You use env: ' + localStorage.env);
	if(localStorage.serviceToken === undefined || localStorage.serviceToken.length < 15) {
		localStorage.serviceToken = prompt('Please enter service token:', 'gobbledygook'); 
	}
	if (localStorage.serviceToken === 'null') { 
		console.log('User canceled serviceToken, start example mode.'); 
	} else {
		console.log('You use token: ' + localStorage.serviceToken);
	}

	const env = 'dev2';

	/* work with settings end */

	var videos = [
		{success: true, R: 'H', renderId: 1, file: 'uploads/thanosMovie.mp4'}, 
		{success: true, R: 'S', renderId: 1, file: 'uploads/1x1.mp4'}, 
		{success: true, R: 'V', renderId: 1, file: 'uploads/916.mp4'}, 
		{success: true, R: 'F', renderId: 1, file: 'uploads/4x5.mp4'}
	],
	currentSize,
	filesUploadResult,
	startRender,
	checkStatusId,
	checkStatus,
	renderStatus,
	renderStatusServer,
	/*progressBar = new ProgressBar.Circle('#progress', {
		color: '#e91e63',
		strokeWidth: 50,
		duration: 300, // milliseconds
		easing: 'easeOut'
	}),*/
	$ = function(name) { return document.querySelector(name) },
	$$ = function(name) { return document.querySelectorAll(name) };

	const circle = document.querySelectorAll('.progress-ring__circle'),
			radius = [circle[0].r.baseVal.value, circle[1].r.baseVal.value],
			circumference = [2 * Math.PI * radius[0], 2 * Math.PI * radius[1]];
		
	circle[0].style.strokeDasharray = `${circumference[0]} ${circumference[0]}`;
	circle[0].style.strokeDashoffset = circumference[0];
	circle[1].style.strokeDasharray = `${circumference[1]} ${circumference[1]}`;
	circle[1].style.strokeDashoffset = circumference[1];

	function setProgress(percent) {
		const offset0 = circumference[0] - percent * circumference[0];
		circle[0].style.strokeDashoffset = offset0;

		const offset1 = circumference[1] - percent * circumference[1];
		circle[1].style.strokeDashoffset = offset1;
	}
	
	// setProgress(74);
	// progressBar.animate(74);

	function clearParam() {
		currentSize = '';
		filesUploadResult = {
			src : '',
			size : ''
		};
		startRender = {
			serviceToken : localStorage.serviceToken,
			renderId : '',
			sizeReq : '',
			effectReq : ''
		};
		checkStatusId,
		checkStatus = {
			serviceToken : localStorage.serviceToken,
			uid : '',
			yandex : '',
			fileName: ''
		};
		renderStatus = {
			total: 60,
			step1: 0,
			step2: 0,
			step3: 0,
			step4: 0
		},
		renderStatusServer = {
				current: 1,
				step1:{
					task:"preparation", 
					total:Math.round(Math.random()*7+5),
				},
				step2:{
					task:"start", 
					total:Math.round(Math.random()*7+5),
				},
				step3:{
					task:"end", 
					total:Math.round(Math.random()*4+2),
				},
				step4:{
					task:"uploading", 
					total:Math.round(Math.random()*7+5),
				},
				step5:{
					task:"finish", 
					total:1,
				},
			};
	}

	clearParam();

	/**
	 * добавить или удалить класс у всех элементов
	 * @param {[type]} selector    [description]
	 * @param {[type]} addClass    [description]
	 * @param {[type]} removeClass [description]
	 */
	function addOrRemoveClassToAll(selector, addClass, removeClass) {
		$$(selector).forEach(function(element) {
			if(typeof addClass !== 'undefined' && addClass.length > 0)
				element.classList.add(addClass);
			if(typeof removeClass !== 'undefined' && removeClass.length > 0)
				element.classList.remove(removeClass);
		});
	}

	/**
	 * добавляет класс COLOR к не выбранным элементам
	 * @param  {[type]} selector [description]
	 * @return {[type]}          [description]
	 */
	function toggleColorClass(selector) {
		$$(selector).forEach(function(element) {
			if(element.checked === false) {
				// element.parentNode.classList.remove('checked');
				if(element.value != filesUploadResult.size) {
					element.parentNode.classList.remove('checked');
					element.parentNode.classList.add('color');
				}
			};
		});
	}

	/**
	 * отключает/включает все кнопки
	 * @param  {[type]} selector [description]
	 * @param  {[type]} status   [description]
	 * @return {[type]}          [description]
	 */
	function btnsDisable(selector, status) {
		$$(selector).forEach(function(element) {
			switch (status) {
				case 'disable':
					element.disabled = true;
					// element.parentNode.classList.remove('checked');
					element.parentNode.classList.remove('color');
					break
				case 'enable':
					if(element.value != filesUploadResult.size) {
						element.disabled = false;
						// element.parentNode.classList.remove('checked');
						element.parentNode.classList.add('color');
					}
					break
				default:
			}
		});
	}

	function consoleLog(msg, EOL = "\n", time = false, reset = false) {
		var consoleDiv = document.querySelector(".console .msg");
		if(reset) consoleDiv.innerText = "";
		var date = new Date();
		if(consoleDiv.innerText == "") $('.workspace-controls').classList.remove('hideconsole');
		consoleDiv.innerText += (time ? ( ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2) + " – ") : "") + msg + EOL;
		consoleDiv.scrollTop = consoleDiv.scrollHeight;
	}

	window.onresize = function(event) {
		// resizeFitPreview('resizer-fit-'+currentSize);
	};

	/**
	 * Функция онклик для кнопок группы А (размеры)
	 */
	$$('.resizer-social-option.stepA input').forEach(function(element) {
		element.addEventListener('click', function(event) {
			// Снимаем выделение с других кнопок размера, они становятся цветными
			// toggleColorClass('.resizer-social-option.stepA input');

			$('.video-uploaded .resizer-fit-preview').classList.remove('resizer-fit-S','resizer-fit-V','resizer-fit-H','resizer-fit-F');
			
			startRender.sizeReq = this.value;

			if(!this.parentNode.parentNode.classList.contains('hide')) {
				$('.video-uploaded .resizer-fit-preview').classList.add('resizer-fit-'+this.value);
				currentSize = this.value;
				addOrRemoveClassToAll('.resizer-social-option.stepA', 'hide');
				addOrRemoveClassToAll('.resizer-social-option.stepB', '', 'hide');
			} else {
				$('.video-uploaded .resizer-fit-preview').classList.add('resizer-fit-'+filesUploadResult.size);
				currentSize = filesUploadResult.size;
				addOrRemoveClassToAll('.resizer-social-option.stepA', '', 'hide');
				addOrRemoveClassToAll('.resizer-social-option.stepB', 'hide');
			}
			// resizeFitPreview('resizer-fit-'+currentSize);

			switch(filesUploadResult.size+"_"+this.value) {
				case "H_S":
				case "H_F":
				case "H_V":
				case "S_F":
				case "S_V":
				case "F_V":
					// blur
					$('.resizer-social-option.stepB input[value="blur"]').click();
					break;
				case "V_F":
				case "V_S":
				case "V_H":
				case "F_S":
				case "F_H":
				case "S_H":
					// crop
					$('.resizer-social-option.stepB input[value="crop"]').click();
					break;
				default:
			}
			this.parentNode.classList.toggle('checked');
			this.parentNode.classList.toggle('colortext');
			this.parentNode.classList.toggle('color');
			this.parentNode.parentNode.classList.toggle('show');

		});
	});


	/**
	 * Функция онклик для кнопок группы B (эффекты)
	 */
	$$('.resizer-social-option.stepB input').forEach(function(element) {
		element.addEventListener('click', function(event) {

			if(this.value === 'render') {
				this.disabled = true;
				$('#progress').classList.add('flipH');
				if(localStorage.env == env) {
					postData('https://'+localStorage.env+'.roasup.com/api/videoResizer/startRender', startRender)
						.then(function(data) {
							console.log(data)
							// consoleLog('start render ' + startRender.renderId + ", uid : " + data.uid);
							consoleLog('PROGRESS:',"\n",false,true);
							if(data.success) {
								// $('.resizer-social-option.stepB label:not(.color)').classList.toggle('checked');
								$('.resizer-social-option.stepA.show label').classList.remove('colortext');
								btnsDisable('.resizer-social-option input','disable');
								checkStatusId = setInterval(checkStatusVideo, 1000);
								checkStatus.uid = data.uid;
							}
						}) // JSON-строка полученная после вызова `response.json()`
						.catch(error => console.error(error));
				} else {
					consoleLog('PROGRESS:');
					$('.resizer-social-option.stepA.show label').classList.remove('colortext');
					btnsDisable('.resizer-social-option input','disable');
					checkStatusId = setInterval(falseRender, 1000);
					checkStatus.uid = "test_test_test";
					// addOrRemoveClassToAll('.resizer-social-option.stepA.show', '', 'show');
					// addOrRemoveClassToAll('.resizer-social-option.stepB', 'hide');
					// addOrRemoveClassToAll('.resizer-social-option.stepC', '', 'hide');
					// progressBar.animate(0);
					// $('#progress').classList.add('disable');					
				}
			} else {
				startRender.effectReq = this.value;

				switch (this.value) {
					case 'crop':
						// $('.video-uploaded .resizer-fit-video.first').classList.toggle('cover');
						// $('.video-uploaded .resizer-fit-preview').classList.toggle('bgblack');
						$('.video-uploaded .resizer-fit-video.first').classList.add('cover');
						$('.video-uploaded .resizer-fit-preview').classList.remove('bgblack');
						$('.video-uploaded .resizer-fit-video.second').classList.remove('blur');
						$('.video-uploaded .resizer-fit-video.second').classList.add('hide');
					break;
					case 'blur':
						// $('.video-uploaded .resizer-fit-video.second').classList.toggle('blur');
						// $('.video-uploaded .resizer-fit-video.second').classList.toggle('hide');
						$('.video-uploaded .resizer-fit-video.second').classList.add('blur');
						$('.video-uploaded .resizer-fit-video.second').classList.remove('hide');
						if($('.video-uploaded .resizer-fit-video.second').classList.contains('blur')) {
							$('.video-uploaded .resizer-fit-video.second').pause();
							$('.video-uploaded .resizer-fit-video.first').pause();
							$('.video-uploaded .resizer-fit-video.second').currentTime = $('.video-uploaded .resizer-fit-video.first').currentTime;
							$('.video-uploaded .resizer-fit-video.second').play();
							$('.video-uploaded .resizer-fit-video.first').play();
						}
						$('.video-uploaded .resizer-fit-preview').classList.add('bgblack');
						$('.video-uploaded .resizer-fit-video.first').classList.remove('cover');
					break;
					default:
				}

				toggleColorClass('.resizer-social-option.stepB input');
				// this.parentNode.classList.toggle('color');
				this.parentNode.classList.remove('color');
				this.parentNode.classList.add('checked');
			}

		});
	});

	/**
	 * Функция онклик для кнопок группы C (результат)
	 */
	$$('.resizer-social-option.stepC input').forEach(function(element) {
		element.addEventListener('click', function(event) {
			// toggleColorClass('.resizer-social-option.stepC input');
			// this.parentNode.classList.toggle('color');
			switch (this.value) {
				case 'yadisk':
					window.open(checkStatus.yandex);
					break;
				case 'share':
					copyToClipboard(checkStatus.yandex);
					window.prompt("Copy to clipboard: Ctrl+C (CMD+C), Enter", checkStatus.yandex);
					break;
				case 'download':
					window.open(checkStatus.yandex + "/" + checkStatus.fileName);
					break;
				case 'new':
					element.disabled = true;
					startFromBegin();
					break;
				default:
			}
		});
	});

	$('#progress').classList.add('disable');
	$('#progress').addEventListener('click', function(event) {
		if(this.classList.contains('disable')) return;
		this.disabled = true;
		startFromBegin();
	});

	/**
	 * функция Начать с начала
	 * @return {[type]} [description]
	 */
	function startFromBegin() {
		console.log('clear all');
		// progressBar.animate(0);
		setProgress(0);
		addOrRemoveClassToAll('.resizer-social-option label.checked', '', 'checked');
		addOrRemoveClassToAll('.resizer-social-option label.colortext', '', 'colortext');
		addOrRemoveClassToAll('.resizer-social-option.stepA', '', 'hide');
		addOrRemoveClassToAll('.resizer-social-option.stepA.show', '', 'show');
		addOrRemoveClassToAll('.resizer-social-option.stepB', 'hide');
		addOrRemoveClassToAll('.resizer-social-option.stepC', 'hide');
		$('.resizer-social-options-container').classList.remove('first'+filesUploadResult.size);
		$('.video-uploaded .resizer-fit-preview').classList.remove('resizer-fit-S','resizer-fit-V','resizer-fit-H','resizer-fit-F');
		$('#dropzone').style.display = '';
		$('.video-uploaded').style.display = '';
		if(checkStatusId) 
			clearInterval(checkStatusId);
		dropzoneItem.removeAllFiles();
		dropzoneItem.removeAllFiles(true);
		$(".console .msg").innerText = '';
		// $('.workspace-controls').classList.add('hideconsole');
		btnsDisable('.resizer-social-option input','disable');
		clearParam();
	}

	/**
	 * Функция подгона превьюхи под размеры устройства
	 * @param  {[type]} fitSizeClass [description]
	 * @return {[type]}              [description]
	 */
	function resizeFitPreview(fitSizeClass) {
		if(fitSizeClass === undefined) {
			var div = $('.video-uploaded .resizer-fit-preview');
			div.classList.remove('resizer-fit-preview', 'video-preview-container', 'bgblack');
			fitSizeClass = div.classList[0];
			div.classList.add('resizer-fit-preview', 'video-preview-container', 'bgblack');
		}
		switch (fitSizeClass) {
			case "resizer-fit-S":
				$('.video-uploaded .'+fitSizeClass).style.height = $('.video-uploaded .'+fitSizeClass).getBoundingClientRect().width+'px';
				break;
			case "resizer-fit-V":
				$('.video-uploaded .'+fitSizeClass).style.height = $('.video-uploaded .'+fitSizeClass).getBoundingClientRect().width/9*16+'px';
				break;
			case "resizer-fit-H":
				$('.video-uploaded .'+fitSizeClass).style.height = $('.video-uploaded .'+fitSizeClass).getBoundingClientRect().width/16*9+'px';
				break;
			case "resizer-fit-F":
				$('.video-uploaded .'+fitSizeClass).style.height = $('.video-uploaded .'+fitSizeClass).getBoundingClientRect().width/4*5+'px';
				break;
			default:
		}
	}

	/**
	 * проверка состояния видео
	 * @return {[type]} [description]
	 */
	function checkStatusVideo() {
		if(localStorage.env == env) {
			postData('https://'+localStorage.env+'.roasup.com/api/videoResizer/checkStatus', checkStatus)
				.then(successCheckStatusVideo) // JSON-строка полученная после вызова `response.json()`
				.catch(error => console.error(error));
		}
	}

	function successCheckStatusVideo(data) {
		console.log(data.task);
		// consoleLog('status: ' + data.task);
		switch(data.task.toLowerCase()) {
			case 'error':
				consoleLog('Ошибка рендера');
				clearInterval(checkStatusId);
				break;
			case 'preparation':
				if(renderStatus.step1==0) consoleLog('ПОДГОТОВКА',' ');
				renderStatus.step1 = renderStatus.step1 + (1 - renderStatus.step1) / renderStatus.total;
				// progressBar.animate(1 - 1/3*renderStatus.step1);
				setProgress(1 - 1/3*renderStatus.step1);
				break;
			case 'start':
				if(renderStatus.step2==0) consoleLog(' | СТАРТ',' ');
				renderStatus.step2 = renderStatus.step2 + (1 - renderStatus.step2) / renderStatus.total;
				// progressBar.animate(2/3 - 1/3*renderStatus.step2);
				setProgress(2/3 - 1/3*renderStatus.step2);
				break;
			case 'end':
				if(renderStatus.step3==0) consoleLog(' | КОНЕЦ', ' ');
				renderStatus.step3++;
				break;
			case 'uploading':
				if(renderStatus.step4==0) consoleLog(' | ВЫГРУЗКА',' ');
				renderStatus.step4 = renderStatus.step4 + (1 - renderStatus.step4) / renderStatus.total;
				// progressBar.animate(1/3 - 1/3*renderStatus.step4);
				setProgress(1/3 - 1/3*renderStatus.step4);
				break;
			case 'finish':
				consoleLog('LINK:',"\n",false,true);
				consoleLog(data.yandex);
				clearInterval(checkStatusId);
				checkStatus.yandex = data.yandex;
				checkStatus.fileName = data.fileName;
				addOrRemoveClassToAll('.resizer-social-option.stepA.show', '', 'show');
				addOrRemoveClassToAll('.resizer-social-option.stepB', 'hide');
				addOrRemoveClassToAll('.resizer-social-option.stepC', '', 'hide');
				btnsDisable('.resizer-social-option input:disabled','enable');
				// progressBar.animate(0);
				setProgress(0);
				$('#progress').classList.add('disable');
				break;
		}
	}

	const copyToClipboard = str => {
		const el = document.createElement('textarea');
		el.value = str;
		el.setAttribute('readonly', '');
		el.style.position = 'absolute';
		el.style.left = '-9999px';
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
	};

	/**
	 * Настройки для области захвата файлов
	 */
	
	Dropzone.autoDiscover = false;

	var dropzoneItem = new Dropzone('#video_upload', {
		url: (localStorage.env == env)?'https://'+localStorage.env+'.roasup.com/api/videoResizer/filesUpload':'/upload.php',
		previewTemplate: $('#preview-template').innerHTML,
		parallelUploads: 1,
		uploadMultiple: false,
		maxFiles: 1,
		maxFilesize: 500,
		thumbnailHeight: 120,
		thumbnailWidth: 120,
		filesizeBase: 1000,
		acceptedFiles: '.mp4',

		renameFile: function(file) {
			return Date.now() + '_' + '.mp4';//file.name;
		},
		uploadprogress: function(file, progress, bytesSent) {
			//progressBar.animate(progress/100);
			setProgress(progress/100);
			console.log([file, progress, bytesSent]);
		},
		params: { 'serviceToken' : localStorage.serviceToken },
		init: function () {
			this.on("error", function(file) {
				console.error("smth error w " + file.name);
				consoleLog("ОШИБКА : «" + file.name + "»");
				this.removeAllFiles();
			});
		
			this.on("drop", function(file) {
				console.log("drop " + file.name);
			});
			this.on("canceled", function(file) {
				console.log("canceled " + file.name);
			});
			
			this.on("sending", function(file, xhr, formData) {
				$('#progress').classList.remove('flipH');
				$('#progress').classList.remove('disable');
				// formData.append("serviceToken", localStorage.serviceToken);
			});
			this.on("success", function(file, response) {

				console.log([file, response]);

				filesUploadResult.src = '';
				filesUploadResult.size = '';

				if(response.success) {
					filesUploadResult.src = response.file;
					filesUploadResult.size = response.R;
					startRender.renderId = response.renderId;
					checkStatus.renderId = response.renderId;

					$('#dropzone').style.display = 'none';
					$('.video-uploaded').style.display = 'initial';
					var divVideo = '<video class="resizer-fit-video" muted loop="" autoplay="" preload="auto" playsinline="" style="">\
							<source src="'+filesUploadResult.src+'" type="video/mp4" />\
						</video>';
					$('.video-uploaded .resizer-fit-preview').innerHTML = divVideo;
					$('.video-uploaded .resizer-fit-preview').innerHTML += divVideo;
					$('.video-uploaded .resizer-fit-preview').classList.add('resizer-fit-'+filesUploadResult.size);
					$('.resizer-social-options-container').classList.add('first'+filesUploadResult.size);
					$$('.video-uploaded .resizer-fit-video')[0].classList.add('first');
					$$('.video-uploaded .resizer-fit-video')[1].classList.add('second', 'hide');
					// resizeFitPreview('resizer-fit-'+filesUploadResult.size);
					
					btnsDisable('.resizer-social-option input:disabled','enable');
				} else {

				}

			});
		}

	});

	if(localStorage.env != env) {
		// Now fake the file upload, since GitHub does not handle file uploads
		// and returns a 404

		var minSteps = 25,
			maxSteps = 50,
			timeBetweenSteps = 100,
			bytesPerStep = 100000;

		dropzoneItem.uploadFiles = function(files) {
			var self = this;

			self.emit('sending');
			
			for (var i = 0; i < files.length; i++) {

				var file = files[i];
				totalSteps = Math.round(Math.min(maxSteps, Math.max(minSteps, file.size / bytesPerStep)));

				for (var step = 0; step < totalSteps; step++) {
					var duration = timeBetweenSteps * (step + 1);
					setTimeout(function(file, totalSteps, step) {
						return function() {
							file.upload = {
							progress: 100 * (step + 1) / totalSteps,
							total: file.size,
							bytesSent: (step + 1) * file.size / totalSteps
							};

							self.emit('uploadprogress', file, file.upload.progress, file.upload.bytesSent);
							if (file.upload.progress == 100) {

							if(parseInt(sessionStorage.numVideo) < videos.length-1) {
								sessionStorage.setItem('numVideo', parseInt(sessionStorage.numVideo)+1);
							} else {
								sessionStorage.setItem('numVideo', 0);
							}

							file.status = Dropzone.SUCCESS;
							self.emit("success", file, videos[sessionStorage.numVideo], null);
							self.emit("complete", file);
							self.processQueue();
							$('#progress').classList.remove('disable');
							//document.getElementsByClassName("dz-success-mark").style.opacity = "1";
							}
						};
					}(file, totalSteps, step), duration);
				}
			}
		}
		
		function falseRender() {
			renderStatusServer["step"+renderStatusServer.current].total--;

			var result = {
				task: renderStatusServer["step"+renderStatusServer.current].task, 
				yandex:"https://yadi.sk/d/E8uEh357SMbd-A", 
				fileName:"resize_989_1570525534235_Gendex%20gxs-700.mp4"
			};

			successCheckStatusVideo(result);

			if (renderStatusServer["step"+renderStatusServer.current].total == 0) {
				renderStatusServer.current++;
			}
		}


	}

	function postData(url = '', data = {}) {
		// Значения по умолчанию обозначены знаком *
		return fetch(url, {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, cors, *same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			// credentials: 'same-origin', // include, *same-origin, omit
			headers: {
				'Content-Type': 'application/json',
				// 'Content-Type': 'application/x-www-form-urlencoded',
			},
			// redirect: 'follow', // manual, *follow, error
			referrer: 'no-referrer', // no-referrer, *client
			body: JSON.stringify(data), 
			// body: Object.keys(data).map(key => key + '=' + data[key]).join('&'), // тип данных в body должен соответвовать значению заголовка "Content-Type"
		})
		.then(response => response.json()); // парсит JSON ответ в Javascript объект
	}

});
