/*
 *
 * @licstart  The following is the entire license notice for the 
 * JavaScript code in this page.
 * 
 * Copyright (c) 2012-2013 RockStor, Inc. <http://rockstor.com>
 * This file is part of RockStor.
 * 
 * RockStor is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published
 * by the Free Software Foundation; either version 2 of the License,
 * or (at your option) any later version.
 * 
 * RockStor is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 * 
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 * 
 */

AddNFSExportView = RockstorLayoutView.extend({
  events: {
    "click #cancel": "cancel"
  },

  initialize: function() {
    this.constructor.__super__.initialize.apply(this, arguments);
    this.template = window.JST.nfs_add_nfs_export;
    this.shares = new ShareCollection();
    // dont paginate shares for now
    this.shares.pageSize = 1000; 
    this.dependencies.push(this.shares);
    this.modify_choices = [
      {name: 'Writable', value: 'rw'}, 
      {name: 'Read-only', value: 'ro'},
    ];
    this.sync_choices = [
      {name: 'async', value: 'async'},
      {name: 'sync', value: 'sync'}, 
    ];
  },
  
  render: function() {
    this.fetch(this.renderExportForm, this);
    return this;
  },

  renderExportForm: function() {
    var _this = this;
    $(this.el).html(this.template({
      shares: this.shares,
      modify_choices: this.modify_choices,
      sync_choices: this.sync_choices
    }));
    this.$('#shares').chosen(); 
    this.$('#add-nfs-export-form :input').tooltip({placement: 'right'});
    this.$('#add-nfs-export-form select').tooltip({placement: 'right'});

    this.$('#add-nfs-export-form').validate({
      ignore: [],
      onfocusout: false,
      onkeyup: false,
      rules: {
        shares: 'required',  
        host_str: 'required'
      },
      
      submitHandler: function() {
        var button = $('#create-nfs-export');
        if (buttonDisabled(button)) return false;
        disableButton(button);
        $.ajax({
          url: '/api/nfs-exports',
          type: 'POST',
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify(_this.$('#add-nfs-export-form').getJSON()),
          success: function() {
            enableButton(button);
            // Hide tooltips so they dont hang around
            $('#add-nfs-export-form :input').tooltip('hide');
            app_router.navigate('nfs-exports', {trigger: true});
          },
          error: function(xhr, status, error) {
            enableButton(button);
          }
        });
       
        return false;
      }
    });
  },
  
  cancel: function(event) {
    event.preventDefault();
    app_router.navigate('nfs-exports', {trigger: true});
  }

});
