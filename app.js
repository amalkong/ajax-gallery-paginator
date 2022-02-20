if(!albumPhotos){albumPhotos = {title:"",description:"",startIndex:0}}

let hasDocument = ('undefined' !== typeof document), 
hasWindow = ('undefined' !== typeof window),
clickEvent = hasDocument && document.ontouchstart ? 'touchstart' : 'click', 

overlay = document.querySelector('.overlay'), paginator = document.querySelector('#paginator'), 
prev = document.querySelector('#prev'), next = document.querySelector('#next'), 
wrapper_size_select = document.querySelector('#wrapper-size-select'), 
object_fit_select = document.querySelector('#object-fit-select'), 
zoom_in_btn = document.querySelector('#zoom-in-btn'), zoom_out_btn = document.querySelector('#zoom-out-btn'), 
imageFrame = document.querySelector('#imageFrame'), imageFrameControls = document.querySelector('#imageFrameControls'), mainImageWrapper = document.querySelector('#mainImageWrapper'), mainImage = document.querySelector('#mainImage'), 

images = (albumPhotos && albumPhotos.images && albumPhotos.images.length > 0) ? albumPhotos.images : [
    'http://gamejunkienz.files.wordpress.com/2012/02/grimfandango.jpg', 'http://onlyhdwallpapers.com/wallpaper/video_games_grim_fandango_lucas_arts_desktop_1024x768_wallpaper-305343.jpg'
  , 'http://www.projects.com/projects_ANDROID/pbd_app/img/gallery/1974-beautiful-black-mother-in-a-amazing-hardcore-gif-image.gif'
  , 'http://bulk2.destructoid.com/ul/128679-GrimFandangoActionFigures.jpg', 'http://www.gamasutra.com/features/20061103/grimfandango02.jpg'
  , 'http://onlyhdwallpapers.com/wallpaper/video_games_grim_fandango_lucas_arts_desktop_1024x768_wallpaper-305343.jpg'
  , 'http://lparchive.org/Grim-Fandango-(Screenshot)/Update%207/02176.gif'
  , 'http://bulk2.destructoid.com/ul/128679-GrimFandangoActionFigures.jpg'
  , 'http://www.gamasutra.com/features/20061103/grimfandango02.jpg'
  , 'http://metavideogame.files.wordpress.com/2011/05/grimhof_03_1081459316.jpg'
  , 'http://3.bp.blogspot.com/_zBnIHQUy4r4/SpxdDw1Z8tI/AAAAAAAABJM/FoCWfc8imnc/s400/GrimFandango1024x768.jpg'
  , 'http://www.deviantart.com/download/184571597/grim_fandango_by_domigorgon-d31w0ct.jpg'
  , 'http://vgboxart.com/boxes/PC/29535-grim-fandango.png?t=1243105773'
  , 'http://kastatic.com/i2/games/1/3/13230/10.png'
  , 'http://www.thunderboltgames.com/s/img600/grimfandango.jpg'
  , 'http://i2.listal.com/image/1425291/936full-grim-fandango-artwork.jpg'
  , 'http://www.xblafans.com/wp-content/uploads//2011/08/Grim-Fandango1.jpg'
  , 'http://media.giantbomb.com/uploads/0/1371/190604-grimfandango106_super.jpg'
  , 'http://gamejunkienz.files.wordpress.com/2012/02/grimfandango.jpg'
  , 'http://onlyhdwallpapers.com/wallpaper/video_games_grim_fandango_lucas_arts_desktop_1024x768_wallpaper-305343.jpg'
  , 'http://lparchive.org/Grim-Fandango-(Screenshot)/Update%207/02176.gif'
  , 'http://bulk2.destructoid.com/ul/128679-GrimFandangoActionFigures.jpg'
  , 'http://www.gamasutra.com/features/20061103/grimfandango02.jpg'
  , 'http://metavideogame.files.wordpress.com/2011/05/grimhof_03_1081459316.jpg'
  , 'http://3.bp.blogspot.com/_zBnIHQUy4r4/SpxdDw1Z8tI/AAAAAAAABJM/FoCWfc8imnc/s400/GrimFandango1024x768.jpg'
  , 'http://www.deviantart.com/download/184571597/grim_fandango_by_domigorgon-d31w0ct.jpg'
  , 'http://vgboxart.com/boxes/PC/29535-grim-fandango.png?t=1243105773'
  , 'http://kastatic.com/i2/games/1/3/13230/10.png'
  , 'http://www.thunderboltgames.com/s/img600/grimfandango.jpg'
  , 'http://i2.listal.com/image/1425291/936full-grim-fandango-artwork.jpg'
], 

cachedImages = images, 
currentPage = 0, perPage = _perPage || 6, 
totalPages = Math.round(images.length / perPage)-1;

function photos(ctx) {
	var page = ~~ctx.params.page;
	currentPage = page;
	var from = page * perPage;
	var to = from + perPage;
	//console.log('showing page %s : %s..%s', page, from, to);
	document.querySelector('#album-info-title').textContent = ctx.params.title ? ctx.params.title : albumPhotos.title;
	document.querySelector('#album-info-description').textContent = ctx.params.description ? ctx.params.description : albumPhotos.description;
	document.querySelector('#album-info-page').textContent = 'showing page :'+ (page +1) + ' of ' + (totalPages +1 );
	imageList = ctx.params.images ? ctx.params.images.slice(from, to) : images.slice(from, to);
	display(imageList);
	adjustPager(page);
	//return imageList;
}

function display(imageList) {
	var frag = document.createDocumentFragment();
	var el = document.querySelector('#photos');
	var x=0;
	el.innerHTML = '';
	imageList.forEach(function(photo){
		var li = document.createElement('li');
		var img = document.createElement('img');
		img.src = photo;
		img.setAttribute('data-img-id',x);
		img.onclick = function(){
			var img_index = Number(this.getAttribute('data-img-id'));
			showImage(photo,imageList,img_index);
		};
		li.appendChild(img);
		frag.appendChild(li);
		x++;
	});
	el.appendChild(frag);
}

function showImage(img,imageList,index) {
	let fit_to_window_btn = document.querySelector('#fit-to-window-btn') || false;
	let zoom_in_btn = document.querySelector('#zoom-in-btn') || false;
    let zoom_out_btn = document.querySelector('#zoom-out-btn') || false;
    let zoom_reset_btn = document.querySelector('#zoom-reset-btn') || false;
	
	let next_img_btn = document.querySelector('#next-img-btn') || false;
	let prev_img_btn = document.querySelector('#prev-img-btn') || false;
	
    let next_preview_img = document.querySelector('#next-preview') || false;
	let prev_preview_img = document.querySelector('#prev-preview') || false;
	
	let windowWidth = window.innerWidth || document.body.clientWidth;
	let windowHeight = window.innerHeight || document.body.clientHeight;
	let _imageHeight = mainImage.height??mainImage.parentElement.offsetHeight;
	let _imageWidth =  mainImage.width??mainImage.parentElement.offsetWidth;
	
	overlay.classList.add('toggled');
	imageFrame.classList.add('toggled');
	mainImage.src = img;
	//positionFrame();
	if(!zoom_in_btn) {
		zoom_in_btn = Object.assign(document.createElement('a'), {'href':'javascript:void(0);', 'id': 'zoom-in-btn', 'class':'btn zoom-in-btn'});
        zoom_in_btn.textContent = ' + ';
        imageFrameControls.appendChild(zoom_in_btn);
    }
	zoom_in_btn.onclick = function(){zoom(mainImage,1.5, "in");/* positionFrame(); */};
	
	if(!zoom_out_btn) {
		zoom_out_btn = Object.assign(document.createElement('a'), {'href':'javascript:void(0);', 'id': 'zoom-out-btn', 'class': 'btn zoom-out-btn'});
	    zoom_out_btn.textContent = ' X ';
        imageFrameControls.appendChild(zoom_out_btn);
    }
	zoom_out_btn.onclick = function(){zoom(mainImage, 1.5, "out");/* positionFrame(); */};
	
	zoom_reset_btn.onclick = function(){
	    Object.assign(mainImage.style, {width: _imageWidth+'px', height: _imageHeight+'px'});
		mainImageWrapper.style.overflow = 'auto';
		//positionFrame();
	}
	
	if(!fit_to_window_btn) {
		fit_to_window_btn = Object.assign(document.createElement('a'), {'href':'javascript:void(0);', 'id': 'fit-to-window-btn', 'class': 'btn fit-to-window-btn'});
	    fit_to_window_btn.textContent = ' [+] ';
        imageFrameControls.appendChild(fit_to_window_btn);
    }
	fit_to_window_btn.onclick = function(){
		mainImage.classList.toggle("fit-to-window");
		if(mainImage.classList.contains("fit-to-window")) 
			fit_to_window_btn.textContent = ' [ x ] ';
		else 
			fit_to_window_btn.textContent = ' [+] ';
	};
	
	mainImage.ondblclick = function(){
	    Object.assign(mainImage.style, {width: _imageWidth+'px', height: _imageHeight+'px'});
		mainImageWrapper.style.overflow = 'auto';
		//positionFrame();
	}
	
	let _length = imageList.length - 1;
	let _nindex = ( (Number(index) + 1) <= _length) ? (Number(index) + 1) : 0;
	let _pindex = ( (index-1) >= 0) ? index-1 : (index === 0 ? _length : index);
    let _pindex2 = ( (index-1) >= 0) ? index-1 : _length;
	_next_photo = imageList[_nindex];
	_prev_photo = imageList[_pindex];
    //alert('current index:'+index+'\n - next index:'+_nindex+'\n - previous index:'+_pindex+'\n - previous index2:'+_pindex2);
	
	if(next_img_btn){next_img_btn.onclick = function(){showImage(_next_photo,imageList,_nindex);}}
	if(prev_img_btn){prev_img_btn.onclick = function(){showImage(_prev_photo,imageList,_pindex);}}
	if(next_preview_img){
		next_preview_img.title = 'Click to view : '+_next_photo;
		next_preview_img.style.backgroundImage = 'url("'+_next_photo+'")';
		next_preview_img.onclick = function(){showImage(_next_photo,imageList,_nindex);}
	}
	
	if(prev_preview_img){
		prev_preview_img.title = 'Click to view : '+_prev_photo;
		prev_preview_img.style.backgroundImage = 'url("'+_prev_photo+'")';
		prev_preview_img.onclick = function(){showImage(_prev_photo,imageList,_pindex);}
	}
}

function adjustPager(page) {
    if (page) {
        prev.style.display = 'inline-flex';
        prev.setAttribute('href', '/album/photos/' + (page - 1));
	    prev.setAttribute('data-prev-page', (page - 1));
    } else {
        prev.style.display = 'none';
    }

    if(page >= totalPages){
	    next.style.display = 'none';
    } else {
	    next.style.display = 'inline-flex';
        next.setAttribute('href', '/album/photos/' + (page + 1));
        next.setAttribute('data-next-page', (page + 1));
    }
	if(totalPages > 0){
		paginator.innerHTML = '';
		var pf = '', fragment = document.createDocumentFragment();
		for(var i=0; i<=totalPages;i++){
			pf = Object.assign(document.createElement('a'), {'href': i, 'className': 'btn'/* ,'data-page-index': i */});
			if(i === page) pf.className += ' active';
			pf.innerHTML = (i+1);
			pf.onclick = function(e){
				e.preventDefault();
				var _p = this.getAttribute('data-page-index') || this.getAttribute('href');
				photos({params:{page:_p}});
			}
			fragment.appendChild(pf);
		}
		paginator.appendChild(fragment);
	}
	showAllSwitch.querySelector(".onoffswitch-inactive > .onoffswitch-switch").textContent = perPage;
}

function zoom(id,zAmount, zDir) {
	var img = typeof id === 'object' ? id : ((id.match(/^.*#/) || id.match(/^#/)) ? document.getElementById(id): document.querySelector(id));
	if(img){
		zDir = zDir??"in";
		let zoom = zAmount??1.5, 
		image = img.style;
		winW = img.width,
		winH = img.height;
		if(zDir === "in"){
			image['width'] = (winW*zoom) + 'px';
			image['height'] = (winH*zoom) + 'px';
		} else {
			image['width'] = (winW/zoom) + 'px';
			image['height'] = (winH/zoom) + 'px';
		}
		image['transition'] = 'all 1s ease-in';
	}
}
const shuffle = (arr) => {
	// Shuffle slide order if needed		
	if (Array.isArray(arr)){
		for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);	// Fisher-Yates shuffle algorithm (jsfromhell.com/array/shuffle)
		return arr
	}

	return this;
}

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
if(wrapper_size_select){
	let _class = wrapper_size_select.value;
	if(!imageFrame.classList.contains(_class)){
		imageFrame.classList.remove("default", "medium", "full");
		imageFrame.classList.add(_class);
	}
	
	wrapper_size_select.addEventListener("change", function(e){
		let _class = this.value;
		if(!imageFrame.classList.contains(_class)){
			imageFrame.classList.remove("default", "medium", "full");
			imageFrame.classList.add(_class);
		}
	})
	
}

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
if(object_fit_select){
	let objf_val = object_fit_select.value;
	mainImage.style.objectFit = objf_val;
	
	object_fit_select.addEventListener("change", function(e){
		let val = this.value;
		mainImage.style.objectFit = val;
	})
}

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
if(showAllToggler){
	if(showAllToggler.checked === true || showAllToggler.checked === "true"){
		document.querySelector('#album-info-page').textContent = 'showing all images : a total of '+ (images.length);
		display(images);
		pager.classList.remove("visible");
	} else {
		//photos({params:{page:2}});
		photos({
			params:{
				title:(albumPhotos.title?albumPhotos.title:false ),
				description:(albumPhotos.description?albumPhotos.description:false ),
				page:(albumPhotos.startIndex?albumPhotos.startIndex:0 )
			}
		});		
		pager.classList.add("visible");
	}

	showAllToggler.addEventListener("change",function(e){
		e.preventDefault();
		if(this.checked === true || this.checked === "true"){
			document.querySelector('#album-info-page').textContent = 'showing all images : a total of '+ (images.length);
			display(images);
			pager.classList.remove("visible");
		} else {
			photos({params:{page: currentPage}});
			pager.classList.add("visible");
		}
	});
}

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
if(shuffleToggler){
	if(shuffleToggler.checked === true || shuffleToggler.checked === "true"){
		images = shuffle(images);
		cachedImages = images;
		//display(images);
		photos({params:{page: currentPage}});
	} else {
		images = cachedImages;
		photos({params:{page: currentPage}});
	}
	shuffleToggler.addEventListener("change",function(e){
		e.preventDefault();
		if(this.checked === true || this.checked === "true"){
			images = shuffle(images);
			cachedImages = images;
			//display(images);
			photos({params:{page: currentPage}});
		} else {
			images = cachedImages;
			photos({params:{page: currentPage}});
		}
	});
}

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
metaBoxToggler.addEventListener(clickEvent,function(e){
	let metaBox = document.querySelector(".meta-box")
	metaBox.classList.toggle("toggled");
	if(metaBox.classList.contains("toggled")){
		this.textContent = "\u2191";
	} else {
		this.textContent = "\u2193";
	}
	
});

next.addEventListener(clickEvent,function(e){
	e.preventDefault();
	var _n = this.getAttribute('data-next-page');
	photos({params:{page:_n}});
});

prev.addEventListener(clickEvent,function(e){
	e.preventDefault();
	var _p = this.getAttribute('data-prev-page');
	photos({params:{page:_p}});
});
imageForm.addEventListener("submit",function(e){
	e.preventDefault();
	e.stopPropagation();
	let url = this.action, body = new FormData(this);
	const plainFormData = Object.fromEntries(body.entries());
	const formDataJsonString = JSON.stringify(plainFormData);
	
	//console.log(plainFormData, formDataJsonString);
	
	const fetchOptions = {
		method: "POST",
		headers: {
			"Content-Type": plainFormData.responseType&&plainFormData.responseType === "json" ? "application/json": "text/html",
			Accept: plainFormData.responseType&&plainFormData.responseType === "json" ? "application/json" : "*",
		},
		body: formDataJsonString,
	};
	
	fetch(url, {method: "POST", body})
	//fetch(url, fetchOptions)
		.then(res=>{
			return res.json();
		})
		.then(data=>{
			if(plainFormData.perPage) perPage = Number(plainFormData.perPage);
			images = data.images?data.images:[];
			totalPages = Math.round(images.length / perPage)-1;
			photos({
				params:{
					title:(data.title?data.title:(plainFormData.title?plainFormData.title:"") ),
					description:(data.description?data.description:(plainFormData.description?plainFormData.description:"") ),
					images,
					page:(data.startIndex?data.startIndex:0 )
				}
			});
		})
		.catch(err => console.log(err));
});

document.querySelector('#image-frame-close-btn').addEventListener(clickEvent,function(e){
	e.preventDefault();
	/* this.style.display = 'none';imageFrame.style.display = 'none'; */
	overlay.classList.remove('toggled');
	imageFrame.classList.remove('toggled');
	
});
document.querySelector('.overlay').addEventListener(clickEvent,function(e){
	e.preventDefault();
	/* this.style.display = 'none';imageFrame.style.display = 'none'; */
	overlay.classList.remove('toggled');
	imageFrame.classList.remove('toggled');
});
