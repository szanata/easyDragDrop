/**
 * jquery.easyDrapDrop <http://github.com/madeinstefano/easyDragDrop>
 * 
 * @version 1
 * 
 * @licensed MIT <see below>
 * @licensed GPL <see below>
 * 
 * @requires jQuery 1.4.x
 * 
 * @author Stéfano Stypulkowski <http://szanata.com>
 *
 */
/**
 * MIT License
 * Copyright (c) 2010 Stéfano Stypulkowski
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy 
 * of this software and associated documentation files (the "Software"), to deal 
 * in the Software without restriction, including without limitation the rights 
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
 * copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/**
 * GPL LIcense
 * Copyright (c) 2010 Stéfano Stypulkowski
 * 
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by the 
 * Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
 * or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License 
 * for more details.
 * 
 * You should have received a copy of the GNU General Public License along 
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

(function ($) {

  $.fn.easyDragDrop = function (options) {

    var 
      defaults = {
        dragStart: function () { },
        dragEnd: function () { },
        dragNode: $(),
        bindType: 'bind',
        targetSet: [],
        distance: 5,
      }, 
      settings = $.extend({}, defaults, options);
    
    settings.dragNode = $(settings.dragNode);
    
    if (settings.distance < 5){settings.distance = 5;}
    
    $.each(settings.targetSet, function (i, t) {
      t.target = $(t.target);
      t.targetEnter = t.targetEnter || function (){};
      t.targetLeave = t.targetLeave || function (){};
      t.drop = t.drop || function (){};
    });

    if (settings.dragNode.size() > 1) {
      throw 'Drag Node must be unique';
    }
    if (!settings.dragNode.parent().size()) {
      $('body').append(settings.dragNode);
    }
    settings.dragNode.hide().addClass('drag-node');

    $(this)[settings.bindType]('mousedown.drag', function (e) {
      e.preventDefault();
      var y = e.pageY - $(window).scrollTop(); //crossbrowser adjust
      settings.dragNode.css({
        position: 'fixed',
        top: y + settings.distance + 'px',
        left: e.pageX + settings.distance + 'px',
        zIndex: 99999,
        display: 'block',
      }).addClass('is-dragging');
      $('body').css('cursor','move');
      settings.dragStart.call(this, e, settings.dragNode);

      $.each(settings.targetSet, function (i, t) {
        var entered = false;
        t.target.live('mouseenter.drop', function (e) {
          if (settings.dragNode.hasClass('is-dragging')) {
            t.targetEnter.call(this, e, settings.dragNode);
            entered = true;
          }
        }).live('mouseleave.drop afterdrop', function (e) {
          if (entered){
            t.targetLeave.call(this, e, settings.dragNode);
            entered = false;
          }
        }).live('mouseup.drop', function (e) {
          if (settings.dragNode.hasClass('is-dragging')) {
            t.targetLeave.call(this, e);
            entered = false;
            t.drop.call(this, e, settings.dragNode);
            // prevent multiple mouseup triggering
            e.stopImmediatePropagation();
            $(window).trigger('mouseup.drag');
          }
        });
      });

      $(window).bind('mousemove.drag', function (e) {
        var y = e.pageY - $(window).scrollTop(); //crossbrowser adjust
        settings.dragNode.css({
          top: y + settings.distance + 'px',
          left: e.pageX + settings.distance + 'px'
        });
      }).bind('mouseup.drag', function () {
        $(window).unbind('mousemove.drag mouseup.drag');
        settings.dragEnd.call(this, e, settings.dragNode);
        $('body').css('cursor','auto');
        $.each(settings.targetSet, function (i, t) {
          t.target.die('mouseenter.drop mouseout.drop mouseup.drop afterdrop');
        });
        settings.dragNode.hide().removeClass('is-dragging');
      });
    });
  }
})(jQuery);
