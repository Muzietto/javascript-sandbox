
// This is proof of concept code to demonstrate the power of bookmarklets
// It will create a division named "snoopDemo" if it doesn't already exist
// and apply some basic styles.   The code will then crawl the current HTML
// DOM and generate a tree-view of the document.  Attach the page's cookies,
// show them to the user (and be all nice and NOT send stuff
// back to the server), and then show everything to the user in a floating division.


  var _snoopDemo=document.getElementById('snoopDemo');
  if (!_snoopDemo) {
     var tbody = document.getElementsByTagName("body")[0];
     var tnode = document.createElement('div');
         tnode.id='snoopDemo';
         tbody.appendChild(tnode);
         _snoopDemo=document.getElementById('snoopDemo');
         _snoopDemo.style.position='absolute';
         _snoopDemo.style.display='block';
         _snoopDemo.style.backgroundColor='#ffdead';
         _snoopDemo.style.border='2px solid #800000';
         _snoopDemo.style.width='600px';
         _snoopDemo.style.height='380px';
         _snoopDemo.style.zIndex='1000';
         _snoopDemo.style.textAlign='left';
         _snoopDemo.style.fontFamily='verdana';
         _snoopDemo.style.fontSize='9pt';
         _snoopDemo.style.padding='2px';
         _snoopDemo.style.MozBorderRadius='10';
   }

   var _xmlStr='';

   function crawlXML(doc) {                             // Crawls an XML document
      if(doc.hasChildNodes()) {                         // If present element has children
         _xmlStr+='<ul><li>'+doc.tagName+'&gt; ';       // Display current tag name
         for(var i=0; i<doc.childNodes.length; i++) {   // for each child node on current level
            crawlXML(doc.childNodes[i]);                // Call this function recursively
         }                                              // end for loop
         _xmlStr+='<\/li><\/ul>';                       // Close the list item.
      } else {                                          // current element has no children
         tmp=doc.nodeValue+' ';                         // Get the value of the current Node
         tmp=tmp.replace(/</g,"&lt;");                  // replace < and > with their html
         tmp=tmp.replace(/>/g,"&gt;");                  // entities &lt; and &gt;
         _xmlStr+=tmp;                                  // Add the node value to the build str
      }                                                 // End childNode check
   }                                                    // End crawlXML

   function snoopHide() {
      _snoopDemo.style.display='none';
      _snoopDemo.innerHTML='';
   }

   crawlXML(document);

   // set the x and Y coordinates so window is visible.
   var scrollTop = 0;
   if (document.documentElement && document.documentElement.scrollTop)
      scrollTop = document.documentElement.scrollTop;
   else if (document.body)
      scrollTop = document.body.scrollTop;

   _snoopDemo.style.top=scrollTop+50+'px';
   _snoopDemo.style.left='75px';

   _xmlStr='<A HREF="" onClick="snoopHide(); return false">Close This Layer</A><BR><BR><div style="overflow: auto; height: 350px">Cookies:<BR>'+document.cookie+'<BR><BR>Document:<BR>'+_xmlStr+'</div>';

   _snoopDemo.innerHTML=_xmlStr;
   _snoopDemo.style.display='block';

