(function(){
    this.DropD = function(){

        var defaults = {
            domid           : "",
            containerClass  : "dropD-container",
            listClass       : "dropD-list",
            isSelect        : false
        }

        if(arguments[0] && typeof arguments[0] === "object"){
            this.options = extendedDefaults(defaults, arguments[0]);
        }
    }

    DropD.prototype.init = function(){
        if(this.options.isSelect){
            buildDropDown.call(this);
        }
        this.li = document.getElementById(this.options.domid).getElementsByTagName('li');
        
        initializeEvents.call(this);
    }
    function  initializeEvents(){
        
        var dropContainer = document.getElementById(this.options.domid);
        var spanLabel = dropContainer.getElementsByTagName('span')[0];
        //this is broken... only stores the most recent drop down
        var obj = this;
       
        var listitems = obj.li;
        var ul = dropContainer.getElementsByTagName('ul')[0];
        
        ul.setAttribute('class', obj.options.listClass);
        dropContainer.setAttribute('class', obj.options.containerClass);

        spanLabel.onclick = function(){
            if(!dropContainer.open){
                dropContainer.setAttribute('class', obj.options.containerClass + ' dropD-active');
                dropContainer.open = true;
            }else{
                dropContainer.setAttribute('class', obj.options.containerClass);
                dropContainer.open = false;
            }
            
            if (document.droplock) clearTimeout(document.droplock);
            document.droplock=setTimeout(function(){document.droplock=null;},300);
            

        }
        document.body.onclick = function(){
           
            /*if (document.droplock) return;
            
            if(dropContainer&&dropContainer.open){
                dropContainer.className += " " + obj.options.containerClass;
                dropContainer.open = false;
            }*/
        }
        /*document.body.onclick = function(){
        if(!document.overlaylock){
            $('#signup_movein').hide();
            $('#signup_tour_date').hide();
            $(".signup_date").attr('data-clicked', '1');
        }
    }*/
        for(var i = 0; i< listitems.length; i++){
             obj.li[i].onclick = function(){
                var opt = this;
                var data = opt.getAttribute('data-value');
                var text = opt.innerHTML;
                
                spanLabel.innerHTML = text;
                spanLabel.setAttribute('data-value', data);
                dropContainer.setAttribute('class', obj.options.containerClass);
                dropContainer.open = false;
                if(obj.options.isSelect){
                    dropContainer.getElementsByTagName('select')[0].value = data;
                }
            }
        }
    }

    function buildDropDown(){
        var contentHolder = document.getElementById(this.options.domid);
        var selectContainer = contentHolder.getElementsByTagName('select')[0];
        var selectoptions = selectContainer.getElementsByTagName('option');
        
        var ul = document.createElement('ul');
        ul.className = 'dropD-list';
        for(var i = 0; i<selectoptions.length; i++){
            var li = document.createElement('li');
            if(i === 0){
                var span = document.createElement('span');
                span.innerHTML = selectoptions[i].innerHTML;
                contentHolder.appendChild(span);
            }
            li.setAttribute('data-value', selectoptions[i].value);
            li.innerHTML = selectoptions[i].innerHTML;
            ul.appendChild(li);
        }
        selectContainer.style.display = 'none';
        contentHolder.appendChild(ul);
    }

    function setDroplock(){
        document.droplock = setTimeout(function(){
            document.droplock = null;
        }, 250);
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