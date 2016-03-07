Links = [
    'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css',
    'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css',
    'https://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css',
    '/stylesheets/style.css'
  ];
Scripts = [
    'https://code.jquery.com/jquery-2.1.4.js',
    'https://code.jquery.com/ui/1.11.4/jquery-ui.js',
    'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js'
  ];
  
/* Fields for login */
LoginFields = [];
LoginFields.push({label:"Username", type:"text"});
LoginFields.push({label:"Password", type:"password"});

/* Fields for signup */
SignupFields = [];
SignupFields.push({label:"Username", type:"text"});
SignupFields.push({label:"Email", type:"text"});
SignupFields.push({label:"Password", type:"password"});

/* Main Nav */
TopLinks = [
  {label: 'Shared Activity', link:'/shared'},
  {label: 'Generate Sheet', link:'/timesheet/create'},
  {label: 'User Settings', link: '/users/settings'},
  {label: 'Edit Shifts', link: '/shifts'},
  {label: 'Logout', link: '/logout'}
];