import { Selector } from 'testcafe';
import { ClientFunction } from 'testcafe';
import { document } from 'testcafe';

fixture `Fixture-Organization`
    .page `test-grp.healthwatch.se`

    var testUserName = 'testuser365@mailinator.com'
    var testPassword = 'password'
    var testTestUserEmail = 'testusertestcafe@guerrillamail.net'
    var bSignIn = Selector('#submit')  
    var testwwwuser01 = 'testwwwuser05292020'
    var testwwwuserpassword = 'password'
    var testwwwuser01email = 'testwwwuser01@guerrillamail.net'

test.skip('Login', async t => {
        const getLocation = await ClientFunction(() => window.location.href)
        const getURL = await ClientFunction(() => window.location.href)() 

    await t
        .typeText(Selector('#ANV'), testUserName)
        .typeText(Selector('#LOS'), testPassword)
        .expect(bSignIn.textContent).contains('Sign in','We Expect that the submit button is in English - Sign In')
        .click(Selector('#submit'))
        .expect(getLocation()).notEql(getURL,'We expect the login to take us to a different page');
});

    /* ==========Organization Page============ */

    /* Edit Short Department to Very very long department this is  says yoda */

 test('Edit-Department', async t => { 
    const getLocation = await ClientFunction(() => window.location.href)
    const getURL = await ClientFunction(() => window.location.href)() 
    const checkUpdatedDepartment = Selector('#ContentPlaceHolder1_Department');

    await t
        .typeText(Selector('#ANV'), testUserName)
        .typeText(Selector('#LOS'), testPassword)
        .expect(bSignIn.textContent).contains('Sign in', 'We Expect that the submit button is in English - Sign in')
        .click(Selector('#submit'))
        .expect(getLocation()).notEql(getURL, 'We expect the login to take us to a different page');

     await t
        .click(Selector('.departmentRow[data-depth="false,true"][data-id="11276"]').find('td').nth(4).find('a').find('img'))
        .click('#ContentPlaceHolder1_Department')
        .pressKey('ctrl+a delete')
        .selectText(Selector('#ContentPlaceHolder1_Department'), 16, 0)
        .typeText(Selector('#ContentPlaceHolder1_Department'), 'Very very long department this is, says yoda', {
            caretPos: 0
        })
        .click('#ContentPlaceHolder1_DepartmentShort')
        .pressKey('ctrl+a delete')
        .selectText(Selector('#ContentPlaceHolder1_DepartmentShort'), 1, 0)
        .typeText(Selector('#ContentPlaceHolder1_DepartmentShort'), 'L', {
            caretPos: 0
        })
        
    // Expect that the Department Name is updated
        .click(Selector('#ContentPlaceHolder1_SaveUnit'))
        .click(Selector('.departmentRow[data-depth="false,true"][data-id="11276"]').find('td').nth(4).find('a').find('img'))
        .click('#ContentPlaceHolder1_Department')
        .expect(checkUpdatedDepartment.value).eql('Very very long department this is, says yoda','Department name should be updated to Very very long department this is, says yoda')

    /* Edit Very very long department this is  says yoda to Short Department  */

        .click(Selector('.departmentRow[data-depth="false,true"][data-id="11276"]').find('td').nth(4).find('a').find('img'))
        .click('#ContentPlaceHolder1_Department')
        .pressKey('ctrl+a delete')
        .selectText(Selector('#ContentPlaceHolder1_Department'), 16, 0)
        .typeText(Selector('#ContentPlaceHolder1_Department'), 'Short Department', {
            caretPos: 0
        })
        .click('#ContentPlaceHolder1_DepartmentShort')
        .pressKey('ctrl+a delete')
        .selectText(Selector('#ContentPlaceHolder1_DepartmentShort'), 1, 0)
        .typeText(Selector('#ContentPlaceHolder1_DepartmentShort'), 'S', {
            caretPos: 0
        })

    // Expect that the Department Name returned to Short Department
        .click(Selector('#ContentPlaceHolder1_SaveUnit'))
        .click(Selector('.departmentRow[data-depth="false,true"][data-id="11276"]').find('td').nth(4).find('a').find('img'))
        .click('#ContentPlaceHolder1_Department')
        .expect(checkUpdatedDepartment.value).eql('Short Department','Department Name should be updated to Short Department')
    });
      
    /* Add user  */

 test('Add-User', async t => { 
    const getLocation = await ClientFunction(() => window.location.href)
    const getURL = await ClientFunction(() => window.location.href)() 
    const aAddUser = Selector('a.add-user')
    const tdUserEmail = Selector('td');
    const aAddUserError = Selector('#ContentPlaceHolder1_AddUserError');
    

    await t
        .typeText(Selector('#ANV'), testUserName)
        .typeText(Selector('#LOS'), testPassword)
        .expect(bSignIn.textContent).contains('Sign in', 'We Expect that the submit button is in English - Sign in')
        .click(Selector('#submit'))
        .expect(getLocation()).notEql(getURL, 'We expect the login to take us to a different page');

    const getTotalUser = Selector('#tableOrg').find('tr').nth(1).find('td').nth(10).innerText 
    const ReceiveInvitePercentage = Selector('.departmentRow[data-depth="false,true"][data-id="11276"]').find('td').nth(15).innerText 
    const ReceivedInvitePercentage2 = Selector('.departmentRow[data-depth="false,true"][data-id="11276"]').find('td').nth(15).innerText 
    const ReceiveInviteNo = Selector('tr').withAttribute('class', /user11276 departmentRow\s+11276/).nth(0).find('td').nth(13).find('a').innerText
    const ReceiveInviteYes = Selector('tr').withAttribute('class', /user11276 departmentRow\s+11276/).nth(0).find('td').nth(13).find('a').innerText
    let compareTotalUser = parseInt(await getTotalUser, 10); 
        compareTotalUser++;

	 await t
        
        .click(Selector('a.add-user').withText('Add user'))
        .typeText(Selector('#ContentPlaceHolder1_Email'), testTestUserEmail)
        .click(Selector('#ContentPlaceHolder1_DepartmentID'))
        .click(Selector('option').withText('Short Department').nth(0))
        .click(Selector('#ContentPlaceHolder1_SaveUser'))

    //Check if the Total user is incremented by 1, if email address already exist, Received invite is not 100% and Received Invite Status is not yet sent
        .expect(getTotalUser).eql(compareTotalUser.toString(),'We expect the value to Increment by 1')
        .expect(tdUserEmail.textContent).notContains(testTestUserEmail,'email address already exist')
        .expect(ReceiveInvitePercentage).notEql('100%', 'We expect the Received invitation to Not 100% ')
        .click(Selector('.iconUser').nth(1).find('img'))
        .expect(ReceiveInviteNo).eql('Send','We expect to be the text as No, Send for invite not yet sent')

    //Send first invite
        .click(Selector('tr').withAttribute('class', /user11276 departmentRow\s+11276/).nth(0).find('td').nth(13).find('a'))
        .click(Selector('.iconUser').nth(1).find('img'))
        .expect(ReceiveInviteYes).eql('Resend','We expect to be the text as Yes, Resend for invite to be resent')

    //Resend Invite
        .click(Selector('tr').withAttribute('class', /user11276 departmentRow\s+11276/).nth(0).find('td').nth(13).find('a'))

    //Check if Invitation arrived in the inbox
        
        await t
        .navigateTo('http://guerrillamail.com/')
        .click(Selector('#inbox-id'))
        .typeText(Selector('#inbox-id').find('input'), 'testusertestcafe', {
            caretPos: 0
        })
        .click(Selector('button').withText('Set'))
        .click(Selector('#gm-host-select'))
        .click(Selector('option').withText('guerrillamail.net'));

        const checkInfoEmail1 = Selector('#email_list').find('tr').nth(0).find('td').nth(1).innerText
        const checkInfoEmail2 = Selector('#email_list').find('tr').nth(1).find('td').nth(1).innerText

        await t
        .wait(60000)
    // Need checking of what browser is running for checking of email          
        .expect(checkInfoEmail1).eql('info@healthwatch.se','We expect that the email from info@healthwatch.se is received')
        .expect(checkInfoEmail2).eql('info@healthwatch.se','We expect that the email from info@healthwatch.se is received')

    //check if email already exist message appears
    await t
        .navigateTo('https://dev-grp.healthwatch.se/Default.aspx?Logout=1')
        .typeText(Selector('#ANV'), testUserName)
        .typeText(Selector('#LOS'), testPassword)
        .expect(bSignIn.textContent).contains('Sign in', 'We Expect that the submit button is in English - Sign in')
        .click(Selector('#submit'))
        .expect(getLocation()).notEql(getURL, 'We expect the login to take us to a different page')

        .click(Selector('a.add-user').withText('Add user'))
        .typeText(Selector('#ContentPlaceHolder1_Email'), testTestUserEmail)
        .click(Selector('#ContentPlaceHolder1_DepartmentID'))
        .click(Selector('option').withText('Short Department').nth(0))
        .click(Selector('#ContentPlaceHolder1_SaveUser'))
        .expect(aAddUserError.innerText).eql('A user with this email address already exist!\n','email address already exist')
        });

    /* Update User */
 
test('Update-User', async t => {
    const getLocation = await ClientFunction(() => window.location.href)
    const getURL = await ClientFunction(() => window.location.href)() 
    const tdUserEmail = Selector('td')
    const personnumber = Selector("#ContentPlaceHolder1_Hidden28")
    const getstoppedDate = Selector('#ContentPlaceHolder1_Stopped')
    const getstopReason = Selector('#ContentPlaceHolder1_StoppedReason')
    const manager = Selector("#ContentPlaceHolder1_Hidden23");
    const editeduseremail = Selector('#ContentPlaceHolder1_Email')
    const ReceiveInvitePercentage = Selector('[data-depth="false,true"][data-id="11277"]').find('td').nth(15).innerTexttest
    const ReceivedInvitePercentage2 = Selector('[data-depth="false,true"][data-id="11277"]').find('td').nth(15).innerText
    const ReceiveInviteNo = Selector('tr').withAttribute('class', /user11276 departmentRow\s+11276/).nth(0).find('td').nth(13).find('a').innerText

    await t
        .typeText(Selector('#ANV'), testUserName)
        .typeText(Selector('#LOS'), testPassword)

    //Check if the Language is English thru "Sign in" word
        .expect(bSignIn.textContent).contains('Sign in', 'We Expect that the submit button is in English - Sign in')
        .click(Selector('#submit'))
        .expect(getLocation()).notEql(getURL, 'We expect the login to take us to a different page');

    //set stopped date 2 days ago
    var today = new Date();
    var comparetoday = new Date();
    var daynow = today.getDate();
    var yyyy = today.getFullYear();
    var totalNumDays = 0;
    var year = today.getFullYear();

    // Check if year is Leap Year
function isLeapYear(year) {
    if(year % 4 == 0)
    {
       if(year % 100 == 0)
       {
          if(year % 400 == 0)
          {
             return true;
          }
          else
          {
             return false;
          }
       }
       else
       {
          return true;
       }
    }
    else
    {
       return false;
    }
}
    //check if it's first day of the month
    if(daynow == 1)
    {
        var mm = today.getMonth();
        switch(mm) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            totalNumDays = 31;
            break;
        case 2:
            totalNumDays = checkLeapYear(year) ? 29 : 28;
            break;
        default:
            totalNumDays = 30;
            break;
        }
        dd = totalNumDays - 1
    }
    //check if it's second day of the month
    else if(daynow == 2)
            {             
                var mm = today.getMonth();
                switch(mm) {
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                    totalNumDays = 31;
                    break;
                case 2:
                    totalNumDays = isLeapYear(year) ? 29 : 28;
                    break;
                default:
                    totalNumDays = 30;
                    break;
                }
                    dd = totalNumDays
            }    
        else 
        {    
            var mm = today.getMonth()+1; 
            var dd = today.getDate()-2;
        } 
 
    if(dd<10) 
    {
        dd='0'+dd;
    } 

    if(mm<10) 
    {
        mm='0'+mm;
    } 

    today = yyyy+'-'+mm+'-'+dd
    comparetoday = yyyy+'-'+mm+'-'+dd

    const getTotalUser = Selector('#tableOrg').find('tr').nth(1).find('td').nth(10).innerText 
    let compareTotalUser = parseInt(await getTotalUser, 10)
        compareTotalUser--;
    let getTotalUserOldValue = parseInt(await getTotalUser, 10)
        getTotalUserOldValue--;

    await t
        .click(Selector('.iconUser').nth(1).find('img'))
                                          
    // Update the first record on the department
        .click(Selector('tr').withAttribute('class', /user11276 departmentRow\s+11276/).nth(0).find('td').nth(2).find('a').nth(0).find('img'))  
        .click(Selector('#ContentPlaceHolder1_Hidden23'))
        .click(Selector('#ContentPlaceHolder1_Hidden23').find('option').withText('No'))
        .click(Selector('#ContentPlaceHolder1_Hidden28'))
        .pressKey('ctrl+a delete')
        .typeText(Selector('#ContentPlaceHolder1_Hidden28'), '1234')
        .click(Selector('#ContentPlaceHolder1_SaveUser'))
        
    // Check if the user manager and personnumer value changes
        .click(Selector('.iconUser').nth(1).find('img'))
        .click(Selector('tr').withAttribute('class', /user11276 departmentRow\s+11276/).nth(0).find('td').nth(2).find('a').nth(0).find('img'))  
        .expect(manager.value).contains('421','Manager value should be No')
        .expect(personnumber.value).contains('*****','person nummber contains ***** and not 1234')
        .click(Selector('#ContentPlaceHolder1_CancelUser'))

    // Set Personnummer to blank
        .click(Selector('.iconUser').nth(1).find('img'))
        .click(Selector('tr').withAttribute('class', /user11276 departmentRow\s+11276/).nth(0).find('td').nth(2).find('a').nth(0).find('img')) 
        .click(Selector('#ContentPlaceHolder1_Hidden28'))
        .pressKey('ctrl+a delete')
        .typeText(Selector('#ContentPlaceHolder1_Hidden28'), ' ')
        .click(Selector('#ContentPlaceHolder1_SaveUser'))

    // Check if personnummer is blank
        .click(Selector('.iconUser').nth(1).find('img'))
        .click(Selector('tr').withAttribute('class', /user11276 departmentRow\s+11276/).nth(0).find('td').nth(2).find('a').nth(0).find('img'))  
        .expect(personnumber.value).contains('','person nummber contains blank')
        .click(Selector('#ContentPlaceHolder1_CancelUser'))

    //Change user Department to "Medium Length Department
        .click(Selector('.iconUser').nth(1).find('img'))
        .click(Selector('tr').withAttribute('class', /user11276 departmentRow\s+11276/).nth(0).find('td').nth(2).find('a').nth(0).find('img'))
        .click(Selector('#ContentPlaceHolder1_Email'))
        .pressKey('ctrl+a delete')
        .typeText(Selector('#ContentPlaceHolder1_Email'),testTestUserEmail + 'x')
        .click(Selector('#ContentPlaceHolder1_DepartmentID'))
        .click(Selector('option').withText('Medium Length Department').nth(0))     

    //Update the Status to Stopped, work related on a date two days ago
        .click(Selector('#ContentPlaceHolder1_StoppedReason'))
        .click(Selector('option').withText('Stopped, work related'))
        .click(Selector('#ContentPlaceHolder1_Stopped'))
        .pressKey('ctrl+a delete')

    //set stopped date 2 days ago
    //TODO: check if month date = 1, subtract 1 from month
        .typeText(Selector('#ContentPlaceHolder1_Stopped'),today.toString())
        .click(Selector('#ContentPlaceHolder1_SaveUser'))

    //Check if stopped Reason ,Stopped date is updated, also check if the email address was added a prefix and also check that the total number of user decremented by 1
        .click(Selector('.iconUser').nth(1).find('img'))
        .click(Selector('tr').withAttribute('class', /user11277\s+11277/).find('td').nth(2).find('a').find('img'))
        .expect(getstoppedDate.value).eql(comparetoday,'Expect date stopped to be todays date minus 2 days')
        .expect(getstopReason.value).eql('1','Expect the value to be Stopped, work related')
        .expect(editeduseremail.value).contains(testTestUserEmail + 'x','Expect prefix email address with some randome character')
        .expect(getTotalUserOldValue.toString()).eql(compareTotalUser.toString(),'We expect the value to decrement by 1')

    //Update email back to initial address again then change Status to "Active" and set the user profile as "Update the user profile as if these settings were"     
        .click(Selector('#ContentPlaceHolder1_Email'))
        .pressKey('ctrl+a delete')
        .typeText(Selector('#ContentPlaceHolder1_Email'),testTestUserEmail)   
        .click(Selector('#ContentPlaceHolder1_StoppedReason'))
        .click(Selector('option').withText('Active'))  
        .click(Selector('label').withText('Update the user profile as if these settings were'))
        .click(Selector('#ContentPlaceHolder1_SaveUser'))
        .wait(2000)

    //Check total number of user activated, Percentage should not be 100%
        .expect(ReceiveInvitePercentage).notEql('\xa0100%\xa0','Expect that the percentage should not be 100%')

    // Send invitation   
        .click(Selector('.iconUser').nth(1).find('img'))
        .click("#tableOrg > tbody > tr.user11277.\\31 1277 > td:nth-child(14) > a")
    
    //Check total number of user activated, Percentage should be 100%

//TODO : Check which browser is running
/*    if((navigator.userAgent.search("MSIE") != -1 ) || (!!document.documentMode == true ))
       { //ie
        await t
        .expect(ReceivedInvitePercentage2).eql(' 100% ','Expect that the percentage should be 100%')
       } 
       else if(navigator.userAgent.search("Chrome") != -1 )
       {
        //chrome
        await t 
        .expect(ReceivedInvitePercentage2).eql('\xa0100%\xa0','Expect that the percentage should be 100%');
       } 
*/    

    //Navigate to guerrillamail.com to check email sent
    await t
        .navigateTo('http://guerrillamail.com/')

    await t
        .click(Selector('#inbox-id'))
        .typeText(Selector('#inbox-id').find('input'), 'testusertestcafe', {
        caretPos: 0
        })
        .click(Selector('button').withText('Set'))
        .click(Selector('#gm-host-select'))
        .click(Selector('option').withText('guerrillamail.net'))   
        .wait(60000) 

    //Select email received to create account    
        .click(Selector('#email_list').find('tr').nth(0).find('td').nth(1))
        .click(Selector("#display_email > div > div.email > div > a"))
        .click(Selector('button').withText('Fortsätt'))
        .click(Selector('button').withText('i accept'))
        .click(Selector('#dropdownMenu'))
        .click(Selector('#dropdownlanguage').find('span').withText('In English'))
        .typeText(Selector('#username'), testwwwuser01)
        .typeText(Selector('#password'), testwwwuserpassword)
        .click(Selector('#email'))
        .pressKey('ctrl+a delete')
        .typeText(Selector('#email'), testwwwuser01email)
        .click(Selector('#BQ4Y'))
        .click(Selector('option').withText('1982'))
        .click(Selector('#BQ4M'))
        .click(Selector('option').withText('Jan'))
        .click(Selector('#BQ4D'))
        .click(Selector('#BQ4D').find('option').withText('22'))
        .click(Selector('#BQ2_1'))
        .click(Selector('#BQ7_0'))
        .click(Selector('#BQ9'))
        .click(Selector('#BQ9').find('option').withText('Working'))
        .click(Selector('#BQ19_0'))
        .click(Selector('#BQ8'))
        .click(Selector('option').withText('25.001 - 40.000 EUR'))
        .click(Selector('#BQ11'))
        .click(Selector('option').withText('Academic degree, bachelor / MSc'))
        .click(Selector('#Approve'))
//        .click(Selector("#personalAgreement")) to be resolve, has issue
        .click(Selector('.slider.round'))
        .click(Selector('#submitButton'))
        .click(Selector("#Form1 > div.container_16.myhealth.two-sides.remind > div.headergroup.grid_16 > div.logincontainer.loggedin.grid_5.alpha.omega > div > a:nth-child(5)"));

//    .expect(editeduseremail.value).contains(testTestUserEmail,'Expect the email address to return to original address')

    //Update the user to it's original department "Short Department"
    await t
        .navigateTo('https://dev-grp.healthwatch.se/Default.aspx?Logout=1') 
	    .typeText(Selector('#ANV'), testUserName)
        .typeText(Selector('#LOS'), testPassword)
        .expect(bSignIn.textContent).contains('Sign in', 'We Expect that the submit button is in English - Sign In')
        .click(Selector('#submit'))
        .click(Selector('.iconUser').nth(1).find('img'))
        .click(Selector('tr').withAttribute('class', /user11277\s+11277/).find('td').nth(2).find('a').find('img'))
        .click(Selector('#ContentPlaceHolder1_DepartmentID'))
        .click(Selector('option').withText('Short Department').nth(0))    
        .click(Selector('#ContentPlaceHolder1_StoppedReason'))
        .click(Selector('option').withText('Stopped, work related'))
        .click(Selector('#ContentPlaceHolder1_Stopped'))
        .pressKey('ctrl+a delete')
        .typeText(Selector('#ContentPlaceHolder1_Stopped'),today.toString())
        .click(Selector("#ContentPlaceHolder1_UserUpdateFrom_2"))
        .click(Selector('#ContentPlaceHolder1_SaveUser'))
        .click(Selector("#tableOrg > tbody > tr:nth-child(4) > td:nth-child(2) > span > img"))
    //    .expect(ReceiveInviteNo).eql('Send','We expect to be the text as No, Send for invite not yet sent')


}).after( async t => {     
    //delete test.healthwatch.se user
        await t    
        .navigateTo('https://test.healthwatch.se')
        .typeText(Selector("#form1 > div.container_16.index > div.headergroup.grid_16 > div.logincontainer.grid_5.alpha.omega > div:nth-child(2) > input"),testwwwuser01)
        .typeText(Selector("#form1 > div.container_16.index > div.headergroup.grid_16 > div.logincontainer.grid_5.alpha.omega > div:nth-child(3) > input"),testwwwuserpassword)
        .click(Selector('#loginButton'))
        .click(Selector("#Form1 > div.container_16.myhealth.two-sides.remind > div.headergroup.grid_16 > div.logincontainer.loggedin.grid_5.alpha.omega > div > a:nth-child(4)"))
        .setNativeDialogHandler(() => true)
        .click(Selector("#Form1 > div.container_16.myhealth.two-sides.about > div.contentgroup.grid_16 > div > div:nth-child(2) > a"));
    
         await t
        .navigateTo('https://dev-grp.healthwatch.se/Default.aspx?Logout=1')
	    .typeText(Selector('#ANV'), testUserName)
        .typeText(Selector('#LOS'), testPassword)
        .expect(bSignIn.textContent).contains('Sign in', 'We Expect that the submit button is in English - Sign In')
        .click(Selector('#submit'))

    //delete added grp user
        .click(Selector("#tableOrg > tbody > tr:nth-child(4) > td:nth-child(2) > span > img"))
        .click(Selector("#tableOrg > tbody > tr.user11276.departmentRow.\\31 1276 > td:nth-child(3) > a:nth-child(2) > img"))
        .click(Selector('#ContentPlaceHolder1_SaveDeleteUser'))
    });

    
fixture `Fixture-Import-Users`
    .page `test-grp.healthwatch.se`

    var testUserName = 'testuser365@mailinator.com'
    var testPassword = 'password'
    var testTestUserEmail = 'testusertestcafe@guerrillamail.net'
    var bSignIn = Selector('#submit')  
    var testwwwuser01 = 'testwwwuser05292020'
    var testwwwuserpassword = 'password'
    var testwwwuser01email = 'testwwwuser01@guerrillamail.net'

test('Import-Users', async t => {
        const getLocation = await ClientFunction(() => window.location.href)
        const getURL = await ClientFunction(() => window.location.href)() 

    await t
        .typeText(Selector('#ANV'), testUserName)
        .typeText(Selector('#LOS'), testPassword)
        .expect(bSignIn.textContent).contains('Sign in','We Expect that the submit button is in English - Sign In')
        .click(Selector('#submit'))
        .expect(getLocation()).notEql(getURL,'We expect the login to take us to a different page');

    //Import User
    await t 
        .click(Selector("#ContentPlaceHolder1_ActionNav > a.import-users"))
        .setFilesToUpload('#ContentPlaceHolder1_UsersFilename', ['ImportUsers.txt'])
        .click(Selector('#ContentPlaceHolder1_ImportUsersParentDepartmentID'))
        .click(Selector('option').withText('Short Department').nth(0))    
        .click(Selector("#ContentPlaceHolder1_SaveImportUser"))

}).after( async t => {     
    await t
        .navigateTo('https://test-grp.healthwatch.se')
        .typeText(Selector('#ANV'), testUserName)
        .typeText(Selector('#LOS'), testPassword)
        .expect(bSignIn.textContent).contains('Sign in','We Expect that the submit button is in English - Sign In')
        .click(Selector('#submit'))

    //delete imported users from grp
    await t
        .click(Selector("#tableOrg > tbody > tr:nth-child(4) > td:nth-child(2) > span > img"))
        .click(Selector("#tableOrg > tbody > tr.user11276.departmentRow.\\31 1276 > td:nth-child(3) > a:nth-child(2) > img"))
        .click(Selector("#ContentPlaceHolder1_SaveDeleteUser"))
        .click(Selector("#tableOrg > tbody > tr:nth-child(5) > td:nth-child(2) > span > img"))
        .click(Selector("#tableOrg > tbody > tr.user11277.\\31 1277 > td:nth-child(3) > a:nth-child(2) > img"))
        .click(Selector("#ContentPlaceHolder1_SaveDeleteUser"))
    });


fixture `Fixture-Add-Unit`
    .page `test-grp.healthwatch.se`

    var testUserName = 'testuser365@mailinator.com'
    var testPassword = 'password'
    var testTestUserEmail = 'testusertestcafe@guerrillamail.net'
    var bSignIn = Selector('#submit')  
    var testwwwuser01 = 'testwwwuser05292020'
    var testwwwuserpassword = 'password'
    var testwwwuser01email = 'testwwwuser01@guerrillamail.net'

test('Add-Unit', async t => {
        const getLocation = await ClientFunction(() => window.location.href)
        const getURL = await ClientFunction(() => window.location.href)() 

    await t
        .typeText(Selector('#ANV'), testUserName)
        .typeText(Selector('#LOS'), testPassword)
        .expect(bSignIn.textContent).contains('Sign in','We Expect that the submit button is in English - Sign In')
        .click(Selector('#submit'))
        .expect(getLocation()).notEql(getURL,'We expect the login to take us to a different page');

     await t
        .click(Selector("#ContentPlaceHolder1_ActionNav > a.add-unit"))
        .typeText(Selector('#ContentPlaceHolder1_Department'),'Delete365')
        .typeText(Selector('#ContentPlaceHolder1_DepartmentShort'),'D365')        
        .click(Selector('#ContentPlaceHolder1_ParentDepartmentID'))
        .click(Selector('option').withText('Bottom').nth(0))
        .click(Selector('#ContentPlaceHolder1_SaveUnit'))
 
}).after( async t => {     
    await t
        .navigateTo('https://test-grp.healthwatch.se')
        .typeText(Selector('#ANV'), testUserName)
        .typeText(Selector('#LOS'), testPassword)
        .expect(bSignIn.textContent).contains('Sign in','We Expect that the submit button is in English - Sign In')
        .click(Selector('#submit'));

     await t
        .click(Selector("#\\31 1281 > span > img"))
        .click(Selector("#tableOrg > tbody > tr.\\31 1281 > td:nth-child(2) > a:nth-child(2) > img"))
        .click(Selector("#ContentPlaceHolder1_SaveDeleteDepartment"))
    });

fixture `Fixture-Import-Units`
    .page `test-grp.healthwatch.se`

    var testUserName = 'testuser365@mailinator.com'
    var testPassword = 'password'
    var testTestUserEmail = 'testusertestcafe@guerrillamail.net'
    var bSignIn = Selector('#submit')  
    var testwwwuser01 = 'testwwwuser05292020'
    var testwwwuserpassword = 'password'
    var testwwwuser01email = 'testwwwuser01@guerrillamail.net'

test('Import-Units', async t => {
        const getLocation = await ClientFunction(() => window.location.href)
        const getURL = await ClientFunction(() => window.location.href)() 

    await t
        .typeText(Selector('#ANV'), testUserName)
        .typeText(Selector('#LOS'), testPassword)
        .expect(bSignIn.textContent).contains('Sign in','We Expect that the submit button is in English - Sign In')
        .click(Selector('#submit'))
        .expect(getLocation()).notEql(getURL,'We expect the login to take us to a different page');

    //Import Units
    await t 
        .click(Selector("#ContentPlaceHolder1_ActionNav > a.import-unit"))
        .setFilesToUpload('#ContentPlaceHolder1_UnitsFilename', ['ImportUnits.txt'])
        .click(Selector("#ContentPlaceHolder1_ImportUnitsParentDepartmentID"))
        .click(Selector('option').withText('Short Department').nth(0))    
        .click(Selector("#ContentPlaceHolder1_SaveImportUnit"))
}).after( async t => {     
    await t
        .navigateTo('https://test-grp.healthwatch.se')
        .typeText(Selector('#ANV'), testUserName)
        .typeText(Selector('#LOS'), testPassword)
        .expect(bSignIn.textContent).contains('Sign in','We Expect that the submit button is in English - Sign In')
        .click(Selector('#submit'))

    await t    
        .click(Selector("#\\31 1277 > span > img"))     
        .click(Selector("#tableOrg > tbody > tr.\\31 1277 > td:nth-child(2) > a:nth-child(2) > img"))
        .click(Selector("#ContentPlaceHolder1_SaveDeleteDepartment"))

        .click(Selector("#\\31 1281 > span > img"))
        .click(Selector("#tableOrg > tbody > tr.\\31 1281 > td:nth-child(2) > a:nth-child(2) > img"))            
        .click(Selector("#ContentPlaceHolder1_SaveDeleteDepartment"))
    });
