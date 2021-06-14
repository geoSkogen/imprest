
How the Pulp-Mill (plpml) string is parsed in JavaScript:

The element string -

The string has three components : DOM selector, HTML addributes, and text content

For example: a#special.classified = would render: <a id='special' class='classified'></a>

Text attributes are essentially in CSS notation:

{href:/nextdir/mypage/} would add an href='/nextdir/mypage/' attribute to the anchor tag.

Text node strings are in parentheses.

'
a#special.classified{href:/nextdir/mypage/}(This the text content of a complete plpml element)

Nesting -

Nesting rules appear in the first list item, followed by the plpml values

The first two-member list is always the container element,

and its first item is always a simple string, alphanumeric only.

Nesting additional elements follows a convention of 'parent_self' - underscore-separated element nicknnames,

where the list item preceding the plpml string refers to the parent object of the element described by the plpml string.

If that sounds like nonsense, try this example:

  ['shell','div#shell.flex-row{}()'],
  ['shell_inner','section#unique.classified{}()'],
  ['inner_header','h1.jumbo{plpml=stage_page}(@_header)'],
  ['shell_body','artice#my-article{plpml=stage_page}(@_body)']

  <div id="shell" class="flex-fow">
   <section id="unqiue class="classified">
     <h1 class="jumbo" plpml="stage_page">@_header</h1>
   </section>
   <article plpml="stage_page">@_body</article>
  </div>  

The plpmal section tag followed by 'shell_inner' becomes as a child element of

the plpml div tag following 'shell' - the 'inner_header' list item precedes

a plpml h1 tag that will append itself to the parent section tag because the

'inner' in 'shell_inner' is the same 'inner' as in 'inner_header.'

The article tag following 'shell_body' will append as child to the tag  

following 'shell.'  
