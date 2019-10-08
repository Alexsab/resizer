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
		console.log('User cancelled serviceToken, start example mode.'); 
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
	filesUploadResult = {
		src : '',
		size : ''
	},
	startRender = {
    	serviceToken : localStorage.serviceToken,
		renderId : '',
		sizeReq : '',
		effectReq : ''
    },
    checkStatusId,
    checkStatus = {
    	serviceToken : localStorage.serviceToken,
    	uid : '',
    	yandex : ''
    },
    $ = function(name) { return document.querySelector(name) },
	$$ = function(name) { return document.querySelectorAll(name) };

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
			        element.parentNode.classList.add('color');
		        }
		    };
		});
	}

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

	/**
	 * Функция онклик для кнопок группы А (размеры)
	 */
	$$('.resizer-social-option.stepA input').forEach(function(element) {
		element.addEventListener('click', function(event) {
			// Снимаем выделение с других кнопок размера, они становятся цветными
			// toggleColorClass('.resizer-social-option.stepA input');

	        $('.video-uploaded .resizer-fit-preview').classList.remove('resizer-fit-S','resizer-fit-V','resizer-fit-H','resizer-fit-F');
	        $('.video-uploaded .resizer-fit-preview').classList.add('resizer-fit-'+this.value);
	        resizeFitPreview('resizer-fit-'+this.value);
	        
	        startRender.sizeReq = this.value;

	        if(!this.parentNode.parentNode.classList.contains('hide')) {
		        addOrRemoveClassToAll('.resizer-social-option.stepA', 'hide');
		        addOrRemoveClassToAll('.resizer-social-option.stepB', '', 'hide');
	        } else {
		        addOrRemoveClassToAll('.resizer-social-option.stepA', '', 'hide');
		        addOrRemoveClassToAll('.resizer-social-option.stepB', 'hide');
	        }

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
				if(localStorage.env == env) {
					this.disabled = true;
					postData('https://'+localStorage.env+'.roasup.com/api/videoResizer/startRender', startRender)
						.then(function(data) {
							console.log(data)
							if(data.success) {
						        $('.resizer-social-option.stepB label:not(.color)').classList.toggle('checked');
								btnsDisable('.resizer-social-option input','disable');
								checkStatusId = setInterval(checkStatusVideo, 1000);
								checkStatus.uid = data.uid;
							}
						}) // JSON-строка полученная после вызова `response.json()`
						.catch(error => console.error(error));
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
					window.prompt("Copy to clipboard: Ctrl+C, Enter", checkStatus.yandex);
					break;
				case 'download':
					break;
				case 'new':
					addOrRemoveClassToAll('.resizer-social-option.stepA', '', 'hide');
					addOrRemoveClassToAll('.resizer-social-option.stepA label', '', 'checked');
					addOrRemoveClassToAll('.resizer-social-option.stepC', 'hide');
				    $('#dropzone').style.display = '';
				    $('.video-uploaded').style.display = '';
				    // addOrRemoveClassToAll('.resizer-social-option radio-label').classList.remove('color');
					
					dropzoneItem.removeAllFiles();
					btnsDisable('.resizer-social-option input','disable');
					break;
				default:
			}
	    });
	});

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
				.then(function(data) {
					console.log(data.task)
					if(data.task == 'Finish') {
						clearInterval(checkStatusId);
						checkStatus.yandex = data.yandex;
						addOrRemoveClassToAll('.resizer-social-option.stepA.show', '', 'show');
						addOrRemoveClassToAll('.resizer-social-option.stepB', 'hide');
						addOrRemoveClassToAll('.resizer-social-option.stepC', '', 'hide');
						btnsDisable('.resizer-social-option input:disabled','enable');
					}
				}) // JSON-строка полученная после вызова `response.json()`
				.catch(error => console.error(error));
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
	  	return Date.now() + '_' + file.name;
	  },
	  // params: { 'serviceToken' : localStorage.serviceToken },
	  init: function () {
		this.on("error", function(file) {
		    console.error("smth error w " + file.name);
		});
		/*
		this.on("drop", function(file) {
		    // alert("drop");
			var progressBar =
			    new ProgressBar.Circle('#progress', {
			        color: '#e91e63',
			        strokeWidth: 50,
			        duration: 2000, // milliseconds
			        easing: 'easeInOut'
			    });

			progressBar.animate(0.8);
		});
		*/
		this.on("sending", function(file, xhr, formData) {
			formData.append("serviceToken", localStorage.serviceToken);
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
				$$('.video-uploaded .resizer-fit-video')[0].classList.add('first');
				$$('.video-uploaded .resizer-fit-video')[1].classList.add('second', 'hide');
			    resizeFitPreview('resizer-fit-'+filesUploadResult.size);
			    
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
		            //document.getElementsByClassName("dz-success-mark").style.opacity = "1";
		          }
		        };
		      }(file, totalSteps, step), duration);
		    }
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
