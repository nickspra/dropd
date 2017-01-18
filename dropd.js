(function(){
    this.DropD = function(){

        var defaults = {
            domid           : "",
            containerClass  : "dropD_container",
            listClass       : "dropD_list",
            dropSpeed       : 500,
            easing          : "ease-in-out",
            maxHeight       : "400px",
            eventType       : 'click'
        }

        if(arguments[0] && typeof arguments[0] === "object"){
            this.options = extendedDefaults(defaults, arguments[0]);
        }
    }

    DropD.prototype.init = function(){
        var contentHolder = document.getElementById(this.options.domid);
        var isSelect = contentHolder.getElementsByTagName('select');
        if(contentHolder) contentHolder.flag = true;
        
        if(isSelect.length > 0){
            this.options.isSelect = true;
            buildDropDown.call(this);
        }else{
            var hiddenClickBox = createHiddenClickBox(this);
            
            contentHolder.appendChild(hiddenClickBox);
        }
        
        this.li = document.getElementById(this.options.domid).getElementsByTagName('li');
        
        this.initializeEvents();
    }
    DropD.prototype.initializeEvents = function(){
        
        var dropContainer = document.getElementById(this.options.domid);
        var spanLabel = dropContainer.getElementsByTagName('span')[0];
        spanLabel.style.zIndex = '2';
        
        var obj = this;
        
        var listitems = obj.li;
        var ul = dropContainer.getElementsByTagName('ul')[0];
        var hiddenClickBox = document.getElementById(obj.options.domid+"_hiddenBox");

        ul.setAttribute('class', obj.options.listClass);
        styleUl(ul, obj);
        dropContainer.setAttribute('class', obj.options.containerClass);
        
        //TODO: properly implement hover event
        if(obj.options.eventType === 'click'){

            spanLabel.onclick = toggleHeight;

        }else if(obj.options.eventType === 'hover'){
            spanLabel.onmouseenter = toggleHeight;

        }
        function toggleHeight(){
            
            if(!dropContainer.open){
                
                ul.style.maxHeight = obj.options.maxHeight;
                ul.style.opacity = 1;
                dropContainer.open = true;
                dropContainer.style.zIndex = 999;
                addClass(dropContainer, obj.options.containerClass + '_active');
                hiddenClickBox.style.display = 'block';
                
            }else{
                ul.style.maxHeight = 0;
                ul.style.opacity = 0;
                dropContainer.open = false;
                removeClass(dropContainer, obj.options.containerClass + '_active');
                hiddenClickBox.style.display = 'none';
                setTimeout(function(){
                    dropContainer.style.zIndex = 0;
                }, obj.options.dropSpeed);
            }
            
        }
        hiddenClickBox.onclick = function(){
            setTimeout(function(){
                dropContainer.style.zIndex = 0;
            }, obj.options.dropSpeed);
            
            dropContainer.open = false;
            removeClass(dropContainer, obj.options.containerClass + '_active');
            ul.style.maxHeight = 0;
            ul.style.opacity = 0;
            this.style.display = 'none';
        }


        for(var i = 0; i< listitems.length; i++){
            obj.li[i].addEventListener('click',function(){
                listhelper(this, obj);
            }, false); 
        }
        function listhelper(li, obj){
            
            var data = li.getAttribute('data-value');
            var text = li.innerHTML;
            
            spanLabel.innerHTML = text;
            spanLabel.setAttribute('data-value', data);

            if(obj.options.isSelect){
                dropContainer.getElementsByTagName('select')[0].value = data;
            }
            hiddenClickBox.style.display = 'none';
            dropContainer.open = false;
            removeClass(dropContainer, obj.options.containerClass + '_active');
            setTimeout(function(){
                dropContainer.style.zIndex = 0;
            }, obj.options.dropSpeed);
            ul.style.maxHeight = 0;
            ul.style.opacity = 0;

        }
        function removeClass(el, cls){
            if(hasClass(el, cls)){
                el.className = el.className.replace(cls, '');
            }
        }
        function addClass(el, cls){
            el.className = el.className.replace(el.className, el.className + ' ' +cls);
        }
        function hasClass(el, cls){
            if((' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1){
                return true;
            }else{
                return false;
            }
        }
    }
    
    function buildDropDown(){
        var obj = this;
        var contentHolder = document.getElementById(this.options.domid);
        var selectContainer = contentHolder.getElementsByTagName('select')[0];
        var selectoptions = selectContainer.getElementsByTagName('option');
        

        var ul = document.createElement('ul');
        ul.className = this.options.listClass;
        styleUl(ul, this);
        
        for(var i = 0; i<selectoptions.length; i++){
            var li = document.createElement('li');
            /*if(i === 0){
                var span = document.createElement('span');
                span.innerHTML = selectoptions[i].innerHTML;
                contentHolder.appendChild(span);
            }*/
            if(selectoptions[i].selected){
               var span = document.createElement('span');
                span.innerHTML = selectoptions[i].innerHTML;
                contentHolder.appendChild(span); 
            }
            li.setAttribute('data-value', selectoptions[i].value);
            li.innerHTML = selectoptions[i].innerHTML;
            if(selectoptions[i].selected && i != 0){
                ul.insertBefore(li, ul.childNodes[0]);
            }else{
                ul.appendChild(li);
            }
            
            
            

            
        }
        selectContainer.style.display = 'none';
        
        var hiddenClickBox = createHiddenClickBox(obj);

        
        contentHolder.appendChild(ul);
        contentHolder.appendChild(hiddenClickBox);
    }

    
    function createHiddenClickBox(obj){

        var hiddenClickBox = document.createElement('div');
        hiddenClickBox.id = obj.options.domid + "_hiddenBox";
        hiddenClickBox.style.cssText = 
            "width: 100%;"      +
            "height: 100%;"     +
            "position: fixed;"  +
            "top: 0px;"         +
            "left: 0px;"        + 
            "zIndex: 0;"        +
            "display:none;"     +
            "cursor: auto;";
        return hiddenClickBox;
    }
    function styleUl(ul, obj){
        ul.style.cssText = 
            "-moz-box-sizing:border-box;"       +
            "box-sizing:border-box;"            +
            "z-index:2;"                        +
            "margin:0;"                         +
            "padding:0;"                        +
            "max-height:0;"                     +
            "overflow: hidden;"                 +
            "position: absolute;"               +
            "width:100%;"                       +
            "opacity: 0;"                       +
            "list-style: none;"                 +
            "transition: all " + obj.options.dropSpeed + "ms " + obj.options.easing + ";";
    }
    function extendedDefaults(source, properties){
        var property;
        for(property in properties){
            if(properties.hasOwnProperty(property)){
                source[property] = properties[property];
            }
        }
        return source;
    }
}());