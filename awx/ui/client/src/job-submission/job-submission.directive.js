/*************************************************
 * Copyright (c) 2016 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import jobSubmissionController from './job-submission.controller';

export default [ 'templateUrl', 'CreateDialog', 'Wait', 'CreateSelect2', 'ParseTypeChange',
    function(templateUrl, CreateDialog, Wait, CreateSelect2, ParseTypeChange) {
    return {
        scope: {
            submitJobId: '=',
            submitJobSystem: '='
        },
        templateUrl: templateUrl('job-submission/job-submission'),
        controller: jobSubmissionController,
        restrict: 'E',
        link: function(scope) {

            scope.openLaunchModal = function() {
                if (scope.removeLaunchJobModalReady) {
                    scope.removeLaunchJobModalReady();
                }
                scope.removeLaunchJobModalReady = scope.$on('LaunchJobModalReady', function() {
                    // Go get the list/survey data that we need from the server
                    scope.getListsAndSurvey();

                    $('#job-launch-modal').dialog('open');

                    // select2-ify the job type dropdown
                    CreateSelect2({
                        element: '#job_launch_job_type',
                        multiple: false
                    });

                    if(scope.step === 'otherprompts' && scope.ask_variables_on_launch) {
                        ParseTypeChange({
                            scope: scope,
                            variable: 'jobLaunchVariables',
                            field_id: 'job_launch_variables'
                        });

                        scope.extra_vars_code_mirror_loaded = true;
                    }

                });

                CreateDialog({
                    id: 'job-launch-modal',
                    scope: scope,
                    width: 800,
                    minWidth: 400,
                    draggable: false,
                    dialogClass: 'JobSubmission-dialog',
                    onOpen: function() {
                        Wait('stop');
                    },
                    callback: 'LaunchJobModalReady'
                });
            };

            scope.clearDialog = function() {
                // Destroy the dialog
                if($("#job-launch-modal").hasClass('ui-dialog-content')) {
                    $('#job-launch-modal').dialog('destroy');
                }
                // Remove the directive from the page
                $('#content-container').find('submit-job').remove();

                // Clear out the scope (we'll create a new scope the next time
                // job launch is called)
                scope.$destroy();
            };

            // This function is used to hide/show the contents of a password
            // within a form
            scope.togglePassword = function(id) {
                var buttonId = id + "_show_input_button",
                inputId = id,
                buttonInnerHTML = $(buttonId).html();
                if (buttonInnerHTML.indexOf("Show") > -1) {
                    $(buttonId).html("Hide");
                    $(inputId).attr("type", "text");
                } else {
                    $(buttonId).html("Show");
                    $(inputId).attr("type", "password");
                }
            };

            scope.init();

        }
    };
}];