            var opacity = 0.0;
      var timer;
      function setOpacity(element_id, opacity) {
          element = document.getElementById(element_id);
          opacity = (opacity == 1) ? 0.99999 : opacity;
          element.style.opacity = opacity;
          element.style.filter = "alpha(opacity:"+opacity*100+")";
      }
      function timedFade(element){
        timer = setTimeout("triggerFade('"+element+"', "+opacity+")", 10);
      }
      function triggerFade(element, this_opacity){
        if(this_opacity <= .75){
          setOpacity(element, this_opacity);
          timedFade(element);
          opacity += 0.05;
        }else{
          clearTimeout(timer);
        }
      }

    	function addFrame(){
    	  var overlay = document.createElement('div');
          overlay.id = "greybase";
      	  overlay.setAttribute('style', 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999999;color:#fff;background-color:#000;');
      	var loader = document.createElement('div');
          loader.id = "loader";
      	  loader.setAttribute('style', 'position:fixed;top:50%;left:50%;width:75px;height:75px;margin:-37px 0 0 -37px;z-index:9999999;');
          loader.innerHTML = '<img src="http://ma.gnolia.com/images/metamag/loading_icon.gif" />';
        var close_button = document.createElement('a');
          close_button.onclick = closeFrame;
          close_button.innerHTML = '<img src="http://ma.gnolia.com/images/metamag/close.gif" alt="close" title="close" style="border:0;padding:0;background:none;margin:0;"/>';
          close_button.href = "javascript:void(0);";    
          close_button.id = "close_button";
      	  close_button.setAttribute('style', 'position:fixed;top:6%;right:6%;z-index:10000001;margin:3px 30px 0 0;font-size:9px;border:1px solid #9EB847;padding:0;background:0;height:15px;width:15px;');
      	var ifr = document.createElement('iframe');
      	  ifr.setAttribute('id', 'metamag_frame');
      	  ifr.setAttribute('name', 'magframe');
          ifr.setAttribute('style', 'width:90%;height:90%;border:0;position:fixed;top:5%;left:5%;z-index:10000000;visibility:visible;display:block;');

        overlay.style.opacity = 0;

      	document.body.appendChild(overlay);
      	document.body.appendChild(loader);
        document.body.appendChild(close_button);
      	document.body.appendChild(ifr);
      	ifr.src = "http://ma.gnolia.com/meta/get?url="+encodeURIComponent(location.href)+"&title="+encodeURIComponent(parent.document.title);
      	timedFade("greybase");
      }
      function closeFrame(){
      	var ifr = document.getElementById('metamag_frame');
      	var close_button = document.getElementById('close_button');
      	var overlay = document.getElementById('greybase');
      	var loader = document.getElementById('loader');
      	ifr.parentNode.removeChild(ifr);
      	close_button.parentNode.removeChild(close_button);
      	overlay.parentNode.removeChild(overlay);
      	loader.parentNode.removeChild(loader);
      }
      if(document.getElementsByTagName('frameset').length > 0 ){
        alert("We're sorry.\nMa.gnolia Roots doesn't work\non pages that use frames.");
      }else if(!document.getElementById('metamag_frame')){
        addFrame();
      }else{
      	closeFrame();
      }
