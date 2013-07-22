Ext.ns('wcli');
Ext.ns('wcli.form');
Ext.ns('wcli.msg');

Ext.util.JSON.decode = function(s) {
	return eval("(" + s + ")");
};

Ext.decode = Ext.util.JSON.decode;
//if(!Ext.is.iOS){
	var inputtype = "number";
//}
//else{
//	var inputtype =  "text";
//}

function setPlexCookie(ckName, ckValue) {
      // Save the value as a cookie, or clear if empty string
      panel.setValues({ ckName: ckValue });
      if (ckValue=="") {
            clearCookie(ckName);
      } else {
            setCookie(ckName, ckValue, 1000);
      }
      // signal to application that Cookie was saved
      panel.submit(wcli.util.evt("Updated", ckName));
      return ckValue;
}
	            
function setCookie(ckName, ckValue, expDays) {
      var expDate = new Date();
      expDate.setDate(expDate.getDate() + expDays);
      var ckValue = escape(ckValue) + ((expDays==null) ? "" : "; expires=" + expDate.toUTCString());
      document.cookie=ckName + "=" + ckValue;
}
	            
function getCookie(ckName) {
      ckName += "=" ;
      var ckArray = document.cookie.split(';');
    for(var i = 0; i < ckArray.length; i++) {
            var ck = ckArray[i];
            while (ck.charAt(0)==' ') {
                  ck = unescape(ck.substring(1,ck.length));
            }
            if (ck.indexOf(ckName) == 0) {
                  return unescape(ck.substring(ckName.length,ck.length));
            }
      }
      return null;
}
	            
function clearCookie(ckName) {
      setCookie(ckName, "", -1) ;
}

Date.monthNames = [nls.month[1], nls.month[2], nls.month[3], nls.month[4], nls.month[5], nls.month[6], nls.month[7], nls.month[8], nls.month[9], nls.month[10], nls.month[11], nls.month[12]];
Ext.ux.DatePicker.prototype.months = [nls.month[1], nls.month[2], nls.month[3], nls.month[4], nls.month[5], nls.month[6], nls.month[7], nls.month[8], nls.month[9], nls.month[10], nls.month[11], nls.month[12]];
Ext.ux.DatePicker.prototype.days = [nls.day[1], nls.day[2], nls.day[3], nls.day[4], nls.day[5], nls.day[6], nls.day[7]];
wcli.DatePicker = Ext.extend(Ext.DatePicker, {
	doneButton : nls.picker.doneButton,
	cancelButton: nls.picker.cancelButton,
});

wcli.form.CalendarPicker = Ext.extend(Ext.form.DatePicker, {
	
    getDatePicker: function() {
        if (!this.datePicker) {
            if (this.picker instanceof wcli.DatePicker) {
                this.datePicker = this.picker;
            } else {
            	var minDate, maxDate;
            	
            	if (this.picker.yearFrom) {
            		minDate = new Date(this.picker.yearFrom, 0, 1);
            	}
            	
            	if (this.picker.yearTo){
            		maxDate = new Date(this.picker.yearTo, 12, 0);
            	}
            	var uxDatePicker = new Ext.ux.DatePicker(Ext.apply(this.picker || {}, {
                	dock: 'bottom',
                	minDate: minDate,
                	maxDate: maxDate,
                	value: this.value,
                	cancelButton: nls.picker.cancelButton
                }));
            	
                this.datePicker = new Ext.Sheet({
                    height  : 200,
                    stretchX: true,
                    stretchY: true,
                    
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    
                    dockedItems: [
                        uxDatePicker
                	],
                	
                	setValue: function(val) {
                		uxDatePicker.setValue(val);
                	},
                    
                    getValue: function() {
                    	return uxDatePicker.getValue();
                    }
                });
            }
            
            uxDatePicker.on({
                scope: this,
                select: function() {
                	this.onPickerChange(this, uxDatePicker.getValue());
                	this.datePicker.hide();
                	this.onPickerHide();
                },
                cancel: function() {
                	this.datePicker.hide();
                	this.onPickerHide();
                }
            });

            this.datePicker.on({
                scope : this,
                change: this.onPickerChange,
                hide  : this.onPickerHide
            });
        }

        return this.datePicker;
    },

    getValue: function(format) {
        var value = this.value || null;
        if(value == null){
        	return value;
        }
        else{
        	return (format && Ext.isDate(value)) ? value.format(Ext.util.Format.defaultDateFormat)
        		: value.format('Ymd');
    	}
    },
});

wcli.form.DatePicker = Ext.extend(Ext.form.DatePicker, {
	
    getDatePicker: function() {
        if (!this.datePicker) {
            if (this.picker instanceof wcli.DatePicker) {
                this.datePicker = this.picker;
            } else {
                this.datePicker = new wcli.DatePicker(Ext.apply(this.picker || {}));
            }

            this.datePicker.setValue(this.value || null);

            this.datePicker.on({
                scope : this,
                change: this.onPickerChange,
                hide  : this.onPickerHide
            });
        }

        return this.datePicker;
    },

    getValue: function(format) {
        var value = this.value || null;
        if(value == null){
        	return value;
        }
        else{
        	return (format && Ext.isDate(value)) ? value.format(Ext.util.Format.defaultDateFormat)
        		: value.format('Ymd');
    	}
    },
});

wcli.form.htmlarea = Ext.extend(Ext.form.TextArea, {

    setValue: function(value){
        this.value = value;

        if (this.rendered && this.fieldEl) {
        	if (this.fieldEl.dom.parentNode) {
        		this.htmlNode = this.fieldEl.dom.parentNode;
        		this.htmlNode.className = "x-form-field-container wcliHTMLArea";
        	}
        }
        
        if (this.htmlNode) {
            this.htmlNode.innerHTML = (Ext.isEmpty(value) ? ' ' : value);
        }

        return this;
    }
});

Ext.reg('wclihtmlarea', wcli.form.htmlarea);


wcli.form.BaseText = Ext.extend(Ext.form.Text, {
	afterRender: function() {
        wcli.form.BaseText.superclass.afterRender.call(this);

        var me = this;
    	var extraControl = this.extraControl;
    	if (extraControl) {
    		Ext.each(extraControl, function(ctl) {
    			if(!ctl.render) {
    				ctl = Ext.create(ctl);	
    			}
    			ctl.render(me.el);
    		});
    	}
	}
});

wcli.form.number = Ext.extend(wcli.form.BaseText, {
	ui: 'number',
	inputType: inputtype,
    minValue : undefined,
    maxValue : undefined,
    stepValue : 0.01,
    renderTpl: [
                '<tpl if="label"><div class="x-form-label"><span>{label}</span></div></tpl>',
                '<tpl if="fieldEl"><div class="x-form-field-container">',
                    '<input id="{inputId}" type="{inputType}" name="{name}" class="{fieldCls}" step="0.01"',
                        '<tpl if="tabIndex">tabIndex="{tabIndex}" </tpl>',
                        '<tpl if="placeHolder">placeholder="{placeHolder}" </tpl>',
                        '<tpl if="style">style="{style}" </tpl>',
                        '<tpl if="minValue != undefined">min="{minValue}" </tpl>',
                        '<tpl if="maxValue != undefined">max="{maxValue}" </tpl>',
                        '<tpl if="stepValue != undefined">step="{stepValue}" </tpl>',
                        '<tpl if="autoComplete">autocomplete="{autoComplete}" </tpl>',
                        '<tpl if="autoCapitalize">autocapitalize="{autoCapitalize}" </tpl>',
                        '<tpl if="autoFocus">autofocus="{autoFocus}" </tpl>',
                    '/>',
                    '<tpl if="useMask"><div class="x-field-mask"></div></tpl>',
                    '</div></tpl>',
                '<tpl if="useClearIcon"><div class="x-field-clear-container"><div class="x-field-clear x-hidden-visibility">&#215;</div><div></tpl>'
            ],
        
    onFocus: function(e) {
    	wcli.form.number.superclass.onFocus.call(this, arguments);
    	
    	if (this.getValue() == "0") {
    		this.setValue("");
    	}
    },
    

    initEvents: function() {
        Ext.form.Text.prototype.initEvents.call(this);

        if (this.fieldEl) {
            this.mon(this.fieldEl, {
                keypress: this.onKeyPress,
                scope: this
            });
        }
    },
    
    onKeyPress: function(e) {
        this.fireEvent('keypress', this, e);
    }

});

Ext.reg('wclinumberfield', wcli.form.number);


wcli.form.text = Ext.extend(wcli.form.BaseText, {
    initEvents: function() {
    	wcli.form.BaseText.prototype.initEvents.call(this);

        if (this.fieldEl) {
            this.mon(this.fieldEl, {
                keypress: this.onKeyPress,
                scope: this
            });
        }
    },
    
    onKeyPress: function(e) {
        this.fireEvent('keypress', this, e);
    }

});

Ext.reg('wclitextfield', wcli.form.text);
wcli.msg.alert = function(title, msg, fn, scope) {
	return new Ext.MessageBox({
        width: 320	
	}).show({
        title : title,
        msg : msg,
        buttons: Ext.MessageBox.OK,
        fn: function(button) {
            fn.call(scope, button);
        },
        scope : scope,
        icon: Ext.MessageBox.INFO
    });
};

wcli.msg.YES = {text : nls.msg.yesButton,    itemId : 'yes', ui : 'action' };
//wcli.msg.NO = {text : nls.msg.noButton,    itemId : 'no'};
wcli.msg.CANCEL = {text : nls.msg.cancelButton,    itemId : 'cancel'};

wcli.msg.confirm = function(title, msg, fn, scope) {
	return new Ext.MessageBox({
        width: 320	
	}).show({
        title : title,
        msg : msg,
        buttons: [wcli.msg.YES, wcli.msg.CANCEL],
        fn: function(button) {
            fn.call(scope, button);
        },
        scope : scope,
        icon: Ext.MessageBox.QUESTION
    });
};

wcli.util = (function() {
	function _esc(str) {
		return str.replace(/ /g, "_");
	}
	
	function util() {
	}
	
	Ext.apply(util.prototype, {
		/**
		 * Returns an options object for an Ext.Ajax.Request options parameter
		 * @param {String} evt The plex event name
		 * @param {String} id The NameID of the control recieving the event
		 * @return {Object} An options object for an Ext.Ajax.Request
		 */
		evt: function(evt, id, params) {
		    wcli.startLoading();
		    if (evt) {
		    	if (!params) {
		    		params = {};
		    	}
		    	params.ctlact = id + ":" + evt;
		    	params.focus = id;
		    }
			return {
				method: "POST",
				disableCaching: true,
				params: Ext.apply({
					pnlid: panel.panelId,
					_type: "json"
				}, params),
				success: function(form, result) {
		            wcli.stopLoading();
					/* Begin create new input field for IOS bug workaround keyboard not displaying on the first numeric field */
		            
		            var inputField = document.createElement("INPUT");
		            document.getElementsByTagName("BODY")[0].appendChild(inputField);
		            inputField.focus();
		            document.getElementsByTagName("BODY")[0].removeChild(inputField);
		  
					/* End create new input field */
					
					if (result.alerts.length > 1) {
						var alerts = result.alerts;
						for (var i=0; i<result.alerts.length; i++){
							if (alerts[i].type == "dialog"){
								wcli.msg.alert('', alerts[i].message, function() {									
								});
							}
							if (alerts[i].type == "enquiry"){
								wcli.msg.confirm('', alerts[i].message, function(btn) {
									if(btn == "yes"){
										panel.submit(wcli.util.evt(null, null, { enqact: 1 }));
									}
									if(btn == "no"){
										panel.submit(wcli.util.evt(null, null, { enqact: 2 }));
									}
									if(btn == "cancel"){
										panel.submit(wcli.util.evt(null, null, { enqact: 3 }));
									}
								});
							}
						}
					}
					if (result.refresh) {
						eval(result.init).call(window);
						var panelConfig = eval(result.refresh);
						
						panel.destroy();
						var newPanel = Ext.create(panelConfig);
						
						controller.on('cardswitch', function() {
							window.panel = newPanel;
							
							wcli.util.addCSSArea(panelConfig.cssArea);
							panelConfig.jsOnLoad();
							
							
						},null, { single: true });
						controller.getLayout();
						controller.setActiveItem(newPanel/*, 'slide'*/);
						eval(result.postInit).call(window);
					}
					else {
						// No point in setting values after a refresh...
						wcli.util.parseStates(result.states);
						panel.setValues(result.values);
						
						var fields = panel.getFields();
				        for (name in result.values) {
				            if (result.values.hasOwnProperty(name)) {
				                var field = fields[name];
				                if (field) {
				                	field.fireEvent('aftersetvalue', field);
				                }
				            }
				        }

					}
				}
			};
		},
		
		parseStates: function(states) {
			states = states || {};
			for (var key in states) {
				if (states.hasOwnProperty(key)) {
					var ctl = panel.getFields()[key];
					if (!ctl || ctl.length === 0) {
						ctl = Ext.getCmp(key);
					}
					wcli.util.parseState(ctl, states[key]);
				}
			}
		},
		
		parseState: function(control, state) {
			if (!control) {
				return;
			}
			
			if (state.optionNames && state.optionValues) {
				var names = state.optionNames,
					values = state.optionValues,
					items = [];
				
				for (var i = 0; i < names.length; i++) {
					items.push({ text: names[i], value: values[i] });
				}
				control.setOptions(items, false);
			}
			
			if (state.gridCols && state.gridRows) {
				var store = window[control.name + '_store'],
					storeConf = wcli.util.gridStore(control.name,
						state.gridCols, state.gridRows);
				store.loadData(storeConf.data);
			}
			
			if (typeof state.disabled !== 'undefined') {
				control[state.disabled ? 'disable' : 'enable']();
			}
			if (typeof state.visible !== 'undefined') {
				control[state.visible ? 'show' : 'hide']();
				var parent = control.up();
				if (parent.xtype == 'toolbar') {
					var tbItemVisible = false;
					parent.items.each(function(tbItem) {
						if (tbItem.xtype != 'spacer' && !tbItem.hidden) {
							tbItemVisible = true;
						}
					});
					if (tbItemVisible == false) {
						parent.setHeight(0);
						window.panel.doComponentLayout();
					} else {
						if (parent.getHeight() < 40) {
							parent.setHeight(40);
							window.panel.doComponentLayout();
						}
					}
				}
			}
			
			if (state.location) {
				var coords = wcli.util.getCoords(state.location),
					marker = window[control.id + '_marker'];
				setTimeout(function() {
					marker.setAnimation(google.maps.Animation.DROP);
					marker.setPosition(coords);
				}, 2000);
				control.update(coords);
			}
			
			if (state.childPanel) {
				var panelConfig = eval(state.childPanel);
				control.removeAll();
				control.add(panelConfig);
			}
		},
		
		htmlEncode: function(str) {
			var dummy = document.createElement('div');
			dummy.innerText = str;
			return dummy.innerHTML;
		},
		
		htmlDecode: function(str) {
			var dummy = document.createElement('div');
			dummy.innerHTML = str;
			return dummy.innerText;
		},
		
		parseControlName: function(cname) {
			var res = {},
				params = cname.split(':');
			
			for (var i = 0; i < params.length; i++) {
				var keyValue = params[i].split('='),
					key = keyValue[0],
					val = keyValue[1];
				if (key && val) {
					res[key] = val;
				}
			}
			
			return res;
		},
		
		regModel: function(name, cols) {

			var model = {
				fields: [{
					name: '$$idx$$',
					type: 'number'
				}]
			};
			
			for (var i = 0; i < cols.length; i++) {
				model.fields.push({ name: cols[i], type: 'string' });
			}
			
			Ext.regModel(name, model);
		},
		
		/**
		 * Generates a row template for the given column definitions
		 * @param {String} cols A column definition array
		 * @return {String} A row template for a List control
		 */
		gridTpl: function(cols, colvis, heads, grouped) {
			var tpl = "";
			tpl += "<table>";
			
			if (grouped) {
				cols.shift();
				colvis.shift();
				heads.shift();
				
				for (var i = 0; i < cols.length; i++) {
					if(colvis[i]==true){
						var c = _esc(cols[i]);
						var h = heads[i].colHeader;
						tpl += "<tr><th>" + h + "</th><td>{" + c + "}</td></tr>";
					}
				}
			}
			else{
				for (var i = 0; i < cols.length; i++) {
					if(colvis[i]==true){
						var c = _esc(cols[i]);
						tpl += "<tr><td>{" + c + "}</td></tr>";
					}
				}
				
			}
			tpl += "</table>";
			return tpl;
		},
		
		dateConvert: function(input) {
		     var format = 'yyyy-mm-dd'; // default format
		     var parts = input.match(/(\d+)/g),
		     			i = 0, fmt = {};
		     format.replace(/(yyyy|dd|mm)/g, function(part) { fmt[part] = i++; });

		     return new Date(parts[fmt['yyyy']], parts[fmt['mm']]-1, parts[fmt['dd']]);
		},
		
		gridHdr: function(cols, colvis, heads, grouped, gridclass, rowclass){
			var tpl = "";
			tpl += "<table class='" + gridclass + "h'><tr class='head" + "'>";
			for (var i = 0; i < cols.length; i++){
				if(colvis[i]==true){
					var h = heads[i].colHeader;
					tpl += "<th class='col" + i + "'>" + h + "</th>";
				}
			}
			tpl += "</tr></table>";	
			return tpl;
		},
		
		gridCol: function(cols, colvis, heads, grouped, gridclass, rowclass){		
			var tpl = "";
			
			tpl += "<table class='" + gridclass + "'><tr class='" + rowclass +"'>";
			for (var i = 0; i < cols.length; i++){
				if(colvis[i]==true){
					var c = cols[i];
					var dataType = heads[i].dataType;
					if (dataType == "Date") {
						c = "[wcli.util.dateConvert(values[\"" + c + "\"]).format(Ext.util.Format.defaultDateFormat)]";
					}
					//if (dataType == "FixedDec" || dataType == "Double"){
					//	c = c.toFixed(2);
					//}
					tpl += "<td class='col" + i + "'>{" + c + "}</td>";
				}
			}
			tpl += "</tr></table>";	
			return tpl;
		},
		
		gridColHdr: function(cols, colvis, heads, grouped, gridclass, rowclass){
			var tpl = "";
			
			for (var i = 0; i < cols.length; i++){
				if (i % 3 == 0) {
					tpl += "<table class='" + gridclass + "h'><tr class='head" + i + "'>";
				}
				if(colvis[i]==true){
						var h = heads[i].colHeader;
						tpl += "<th class='col" + i + "'>" + h + "</th>";
				}
				if (i % 3 == 2){
					tpl += "</tr></table>";
				}
			}
			if (i % 3 != 2) {
				tpl += "</tr></table>";				
			}
			return tpl;
		},
		
		gridColTpl: function(cols, colvis, heads, grouped, gridclass, rowclass, imgColNum){			
			var tpl = "";
			
			for (var i = 0; i < cols.length; i++){
				if(i %3 == 0){
					tpl += "<table class='" + gridclass + "'><tr class='" + rowclass +"'>";
				}
				if(colvis[i]==true){
					var c = cols[i];
					var dataType = heads[i].dataType;
					if (dataType == "Date") {
						c = "[wcli.util.dateConvert(values[\"" + c + "\"]).format(Ext.util.Format.defaultDateFormat)]";
					}
					if (dataType == "FixedDec" || dataType == "Double"){
						c = c.toFixed(2);
					}
					if (i+1 == parseInt(imgColNum)) {
						tpl += "<td class='col" + i + "'><div class='img{" + c + "}'></div></td>";
					} else {
						tpl += "<td class='col" + i + "'>{" + c + "}</td>";
					}
				}
				if (i % 3 == 2){
					tpl += "</tr></table>";
				}
			}
			if (i % 3 != 2) {
				tpl += "</tr></table>";				
			}
			return tpl;
		},
		
		gridStore: function(model, cols, rows) {
			if (typeof cols === 'string') {
				cols = JSON.parse(cols);
			}
			if (typeof rows === 'string') {
				rows = JSON.parse(rows);
			}
			
			var store = {
				model: model,
				groupField: _esc(cols[0]),
				/*sorters: _esc(cols[0]),*/
				data: []
			};
			for (var i = 0; i < rows.length; i++) {
				var row = rows[i],
					item = {};
				for (var j = 0; j < row.length; j++) {
					var name = cols[j];
					item[_esc(name)] = row[j].v;
				}
				item['$$idx$$'] = i;
				store.data.push(item);
			}
			
			return store;
		},
		
		getDate: function(dateStr) {
			var year, month, day;
			
			if (!dateStr) {
				return null;
			}
			else if (dateStr.length == 8) {
				year = parseInt(dateStr.substring(0, 4), 10);
				month = parseInt(dateStr.substring(4, 6), 10);
				day = parseInt(dateStr.substring(6, 8), 10);
			}
			else {
				year = parseInt(dateStr.substring(0, 4), 10);
				month = parseInt(dateStr.substring(5, 7), 10);
				day = parseInt(dateStr.substring(8, 10), 10);
			}
			
			return new Date(year, month - 1, day);
		},
		
		getCoords: function(coordsStr) {
			var coords = coordsStr.split(','),
				long, lat;
			if (coords.length >= 2) {
				lat = parseFloat(coords[0].trim());
				long = parseFloat(coords[1].trim());
			}
			else {
				lat = 30.238339;
				long = -97.879745;
			}
				
			return new google.maps.LatLng(lat, long);
		},
		
		addCSSArea: function(cssArea) {
			var links = document.getElementsByTagName("LINK");
			var linkExist = false;
			for(var i=0; i<links.length; i++){
				if(links[i].href.indexOf(cssArea) != -1){
					linkExist = true;
					break;
				}
			}
			if(linkExist == false){
				cssArea.forEach(function(css) {
					Ext.DomHelper.append(Ext.getBody(), { tag: 'link', rel: 'stylesheet', type: 'text/css', href: css });
				});
			}
		}
	});
	
	   /* Timer used to display mask when data is loading. */
	   wcli.loadTimer = null;

	   /* The amount of time in milliseconds before the load mask should appear. */
	   wcli.LOADMASK_TIME = 350;

	   /**
	    * Called when a server request is started. If the request is not finished
	    * within LOADMASK_TIME milliseconds, then the loading mask will appear.
	    */
	   wcli.startLoading = function() {
	       if (wcli.loadTimer) {
	           clearTimeout(wcli.loadTimer);
	       }
	       wcli.loadTimer = setTimeout(function() {
	           wcli.LoadMask.show();
	           wcli.loadTimer = null;
	       }, wcli.LOADMASK_TIME);
	   };

	   /**
	    * Called when a server request has stopped. If the loading mask is shown
	    * it will disappear.
	    */
	   wcli.stopLoading = function() {
	       wcli.LoadMask.hide();
	       if (wcli.loadTimer) {
	           clearTimeout(wcli.loadTimer);
	           wcli.loadTimer = null;
	       }
	   };

	   wcli.hideKeyboard = function(){
		   var activeElement = document.activeElement;
	        activeElement.setAttribute('readonly', 'readonly'); // Force keyboard to hide on input field.
	        activeElement.setAttribute('disabled', 'true'); // Force keyboard to hide on textarea field.
	        Ext.defer(function() {
	            activeElement.blur();
	            // Remove readonly attribute after keyboard is hidden.
	            activeElement.removeAttribute('readonly');
	            activeElement.removeAttribute('disabled');
	        }, 100);
	   };
	
	
	   /**
	    * Called to automatically grow multiline edit based on input text
	    */
	   
	   wcli.autoExpand = function(controlname) {
		   var textdiv = document.getElementById(controlname);
		   if (Ext.getCmp(controlname).xtype == "wclihtmlarea"){
			   var textarea = textdiv.firstElementChild
		   }
		   else{
			   var textarea = textdiv.firstElementChild.firstElementChild
		   }
		   var newHeight = textarea.scrollHeight;
		   var currentHeight = textarea.clientHeight;
		   
		   if (newHeight == 0 && currentHeight == 0){
			   textarea = textdiv.childNodes[1].firstElementChild;
			   newHeight = textarea.scrollHeight;
			   currentHeight = textarea.clientHeight;
		   }
		   
		   if(newHeight > currentHeight){
			   textarea.style.height = newHeight + 'px';
		   }
	   };
	   
	   /**
	    * Validate input maxlength to prevent user enter more than specified length
	    */
	   
	   wcli.validateMaxLength = function(controlname){
		   var input = Ext.getCmp(controlname);
		   var maxlength = input.maxLength; 
		   var value = Ext.getCmp(controlname).getValue();
		   var length = value.length;
		   if (!maxlength){
			   return
		   }
		   if (length>=maxlength){
			   window.event.preventDefault();
			   window.event.stopPropagation();
		   }
	   };
	return new util();
})();
