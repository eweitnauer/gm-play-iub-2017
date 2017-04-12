g_matchExpressionFormat = [
    [
        'x+y+z',
        'x+z+y',
        'y+x+z',
        'y+z+x',
        'z+x+y', 
        'z+y+x'
    ],
    [
        'x-y+z', 
        'x+z-y', 
        '-y+x+z',
        '-y+z+x',
        'z+x-y', 
        'z-y+x'
    ],
    [
        'x*y+z',
        'z+x*y', 
        'y*x+z', 
        'z+y*x'
    ],
    [
        'x+y/z+w',
        'w+y/z+x',
        'y/z+x+w',
        'y/z+w+x',
        'x+w+y/z',
        'w+x+y/z'
    ],
    [
        'a*b-c*d',
        '-c*d+a*b',
        'b*a-c*d',
        '-c*d+b*a',
        'a*b-d*c',
        '-d*c+a*b',
        'b*a-d*c',
        '-d*c+b*a'
    ],
    [
        'p*w+t*w',
        't*w+p*w',
        '(p+t)*w',
        'w*(p+t)',
        '(t+p)*w',
        'w*(t+p)'
    ],
    [
        'a*m-b*m+c',
        '-b*m+a*m+c',
        'm*a-b*m+c',
        'a*m-m*b+c',
        'c+a*m-b*m',
        'c+m*a-b*m',
        'c+m*a-m*b',
        'c+a*m-b*m'
        
    ],
    [
        'n/x+m/x',
        'm/x+n/x',
        '1/x*(m+n)',
        '(m+n)*1/x',
        '1/x*(n+m)',
        '(n+m)*1/x'
    ],
    [
        't*p/c',
        'p/c*t',
        't*p*c^(-1)',
        'p*c^(-1)*t'
    ],
    [   "x+y=z",
        "y+x=z",
         "x=z-y",
         "x=-y+z",
         "y=z-x",
         "y=-x+z",
         "z=x+y",
         "z=y+x",
         "z-y=x",
         "-y+z=x",
         "-y=x-z",
         "-y=-z+x",
         "-x-y=-z",
         "-x=-z+y",
         "-x=y-z",
         "-z+y=-x"
    ],
    [   "a*x-b=c",
        "a*x=c+b",
         "x*a-b=c",
         "-b+a*x=c",
         "-b+x*a=c",
         "x*a=c+b",
         "a*x-c=b",
         "x*a-c=b",
         "-c+a*x=b",
         "-c+x*a=b",
         "a*x=b+c",
         "b+c=a*x",
         "c+b=a*x",
         "b+c=x*a",
         "c+b=x*a",
         "c=a*x-b",
         "c=x*a-b",
         "c=-b+a*x",
         "c=-b+x*a",
         "b=-c+a*x",
         "b=-c+x*a",
         "b=a*x-c",
         "b=x*a-c"
    ],
    [            
        "5*(a+b)=c",
        "a+b=c/5",         
         "b=c/5-a",         
         "b*5=c-a*5",         
         "b*5=c-5*a",         
         "5*b=c-5*a",         
         "5*b=-5*a+c",         
         "b*5=-5*a+c",         
         "b*5=-a*5+c",         
         "b*5+a*5=c",         
         "(b+a)*5=c",         
         "b+a=c/5"     
    ],
    [   "(a+b)/m=n","a+b=n*m", "a+b=m*n", "(a+b)/n=m", "(b+a)/m=n", "b+a=n*m",
        "b+a=m*n", "(b+a)/n=m", "n*m=b+a", "m*n=b+a", "m=(b+a)/n", "n=(b+a)/m", "n*m=a+b", "n=(a+b)/m", "m*n=a+b", "m=(a+b)/n", "(a+b)*1/m=n", "(b+a)*1/m=n", "1/m*(a+b)=n", "1/m*(b+a)=n", "n=(a+b)*1/m", "n=1/m*(a+b)", "n=1/m*(b+a)", "n=(b+a)*1/m", "(a+b)=n*m", "(a+b)*1/n=m", "(b+a)*1/n=m", "1/n*(a+b)=m", "1/n*(b+a)=m", "m=1/n*(a+b)", "m=1/n*(b+a)", "m=(a+b)*1/n", "m=(b+a)*1/n"
    ],
    [   "(r+5)/p=q","r+5=p*q", "r+5=q*p", "5+r=q*p", "5+r=p*q", "(5+r)/p=q", "(r+5)*1/p=q",
        "(5+r)*1/p=q", "1/p*(r+5)=q", "1/p*(5+r)=q", "(r+5)/q=p", "(5+r)/q=p", "(r+5)*1/q=p", "(5+r)*1/q=p", "1/q*(r+5)=p", "1/q*(5+r)=p", "q=(r+5)/p", "q=(5+r)/p", "q*p=r+5", "q*p=5+r", "p*q=r+5", "p*q=5+r", "p=(r+5)/q", "p=(5+r)/q", "q=1/p*(r+5)", "q=1/p*(5+r)", "q=(r+5)*1/p", "q=(5+r)*1/p", "p=1/q*(r+5)", "p=1/q*(5+r)", "p=(r+5)*1/q", "p=(5+r)*1/q"
    ],
    [   "3*a^2+6*b^2+8",
        "3*a^2+8+6*b^2",
        "8+6*b^2+3*a^2",
        "6*b^2+8+3*a^2",
        "6*b^2+3*a^2+8",
        "8+6*b^2+3*a^2",
        "8+3*a^2+6*b^2",
        "8+3*(a^2+2*b^2)",
        "8+(a^2+2*b^2)*3",
        "3*(a^2+2*b^2)+8",
        "(a^2+2*b^2)*3+8",
        "3*(2*b^2+a^2)+8",
        "(2*b^2+a^2)*3+8",
        "8+3*(2*b^2+a^2)",
        "8+(2*b^2+a^2)*3",
        "3*a^2+2*(3*b^2+4)",
        "3*a^2+(3*b^2+4)*2",
        "3*a^2+2*(3*b^2+4)",
        "2*(3*b^2+4)+3*a^2",
        "(3*b^2+4)*2+3*a^2",
        "2*(4+3*b^2)+3*a^2",
        "(4+3*b^2)*2+3*a^2",
        "(3*b^2+4)*2+3*a^2",
        "2*(3*b^2+4)+3*a^2",
        "3*a^2+2*(4+3*b^2)",
        "3*a^2+(4+3*b^2)*2"
    ],
    [   "5*a+b=d*a+c",
        "5*a=d*a+c-b","5*a=d*a-b+c","5*a=c-b+d*a","5*a=-b+c*d*a","5*a=-b+a*d+c","5*a=r+a*d-c","d*a+c-b=5*a","d*a-b+c=5*a","-b+c+a*d=5*a","a*(5-d)+b=c","c=b+a*(5-d)","b=a*(d-5)+c","b=c+a*(d-5)","a*(d-5)=b-c","b-c=a*(d-5)"
    ],
    [   "p^2*q^2/r^2","(p*q)^2/r^2","(q*p)^2/r^2","p^2*1/r^2*q^2","p^2*q^2*1/r^2","q^2*p^2*1/r^2",
        "1/r^2*(p*q)^2","1/r^2*(q*p)^2","q^2*1/r^2*p^2","1/r^2*q^2*p^2","1/r^2*p^2*q^2","p^2/r^2*q^2","q^2*p^2/r^2"
    ],
    ["y^2+a*y^2=c*y^2","a*y^2+y^2=c*y^2","a*y^2=c*y^2-y^2","a*y^2=-y^2+c*y^2","-c*y^2+a*y^2=-y^2","a*y^2-c*y^2=-y^2","-c*y^2=-y^2-a*y^2","-c*y^2=-a*y^2-y^2","y^2*(1+a)=c*y^2","y^2*(a+1)=c*y^2","(1+a)*y^2=c*y^2","(a+1)*y^2=c*y^2","(1*y^2+a*y^2)=c*y^2","y^2=c*y^2-a*y^2","y^2=(c-a)*y^2","y^2=(-a+c)*y^2","y^2=y^2*(c-a)","y^2=y^2*(-a+c)","y^2=(c*y^2-a*y^2)","a*y^2=(c-1)*y^2","a*y^2=(-1+c)*y^2","a*y^2=y^2*(c-1)","a*y^2=y^2*(-1+c)"]
]

g_matchEqProblemsFormat = [
        [
              'x=y'
            , 'x-y=0'
            , '-y+x=0'
            , 'y=x'
            , '-y=-x'
            , '-x=-y'
            , '0=x-y'
            , '0=-y+x'
        ],
    ]
    
g_solveForXEqProblemsFormat = [
        [
              'N*a=N'
            , 'N+a=N'
            , 'a+N=N'
            , 'a-N=N'
            , 'a/N=N'
        ],
    
        [   "N*a-N=N",
            "N*a=N+N",
             "a*N-N=N",
             "-N+N*a=N",
             "-N+a*N=N",
             "a*N=N+N",
             "N*a-N=N",
             "a*N-N=N",
             "-N+N*a=N",
             "-N+a*N=N",
             "N*a=N+N",
             "N+N=N*a",
             "N+N=N*a",
             "N+N=a*N",
             "N+N=a*N",
             "N=N*a-N",
             "N=a*N-N",
             "N=-N+N*a",
             "N=-N+a*N",
             "N=-N+N*a",
             "N=-N+a*N",
             "N=N*a-N",
             "N=a*N-N"
        ],
        [            
            "N*(a+N)=N",
            "N*(N+a)=N",       
            "(N+a)*N=N",
            "(a+N)*N=N",
            "N=N*(a+N)",
            "N=N*(N+a)",      
            "N=(N+a)*N",
            "N=(a+N)*N",             
        ],
        [    "a/N+N=N",
             "N+a/N=N",         
             "a/N=N-N",
             "N=a/N+N",
             "N=N+a/N",
             "N-a/N=N",
             "N-N=a/N",
             "-N+N=a/N",
             "N=N-a/N"
        ],
        [    "(a+N)/N=N",
             "(N+a)/N=N",
             "(a+N)*1/N=N",
             "(N+a)*1/N=N",
             "1/N*(a+N)=N",
             "1/N*(N+a)=N",
             "(a+N)/N=N",
             "(N+a)/N=N",
             "(a+N)*1/N=N",
             "(N+a)*1/N=N",
             "((a+N)*1)/N=N",
             "1/N*(a+N)=N",
             "1/N*(N+a)=N",
             "N=(a+N)/N",
             "N=(N+a)/N",
             "N=(a+N)/N",
             "N=(N+a)/N",
             "N=1/N*(a+N)",
             "N=1/N*(N+a)",
             "N=(a+N)*1/N",
             "N=(N+a)*1/N",
             "N=1/N*(a+N)",
             "N=1/N*(N+a)",
             "N=(a+N)*1/N",
             "N=(N+a)*1/N"
        ],
        [    "N*(N*a-N)=N",
             "N*(N*a+N)=N",
             "(N*a+N)/N=N",
             "(N*a-N)/N=N",
             "N*(a/N+N)=N",
             "N*(a/N-N)=N"
        ],
        [   "N+a=N*a-N","a+N=N*a-N","a+N=N*a-N*N","a+N=N*(a-N)","a+N=(a-N)*N","a+N=(N*a-N*N)","a+N=-N+N*a","a-N*a+N=-N","a-N*a=-N-N","-N*a+a=-N-N","a-N*a+N=-N","a+N=-N+N*a","a+N=N*a-N","a+N=a*N-N","a=N*a-N-N"
        ],
        ["N*(N+a)=N*a+N",
         "N*(a+N)=N*a+N",
         "(a+N)*N=N*a+N",
         "(N+a)*N=N*a+N",
         "N*(a+N)=N+N*a",
         "N*(a+N)-N*a=N",
         "(a+N)*N=N+N*a"
        ],
        ["(N+a)/N=(N*a+N)/N","(a+N)/N=(N*a+N)/N","(a+N)/N=(N+N*a)/N","(a+N)/N=(a*N+N)/N","(a+N)/N=(N+a*N)/N","(a*N+N)/N=(a+N)/N","(N+a*N)/N=(a+N)/N","(N*a+N)/N=(a+N)/N","(N*a+N)/N=(N+a)/N"]
        
    ]
     
g_simplifyExpressionFormat =[
     [
        'N*N',
        'N+N',
        'N/N',
        'N-N'
     ],

     [
        'N+N-N',
        'N-N+N',
        'N*N*N',
        'N+N+N',
        'N-N-N'
     ],

     [
         'N*N-N',
         'N+N*N',
         'N*N+N',
         'N*N+N',
         'N*N+N'
     ],
     [
        'N+N/N-N',
        'N-N/N+N',
        'N/N-N',
        'N/N+N',
        'N+N/N+N',
        'N-N/N-N'
     ],
     [
        'N+N/N-N*N',
        'N-N/N+N/N',
        'N/N-N*N-N',
        'N/N+N/N*N',
        'N+N*N+N-N',
        'N-N/N-N+N'
     ],
     [
        'N*(N+N)',
        'N+(N*N)',
        '(N+N)*N',
        '(N*N)+N',
        'N*(N-N)',
        'N-(N*N)',
        '(N-N)*N',
        '(N*N)-N'
     ],

     [
        'N*(N+N)+N',
        'N*(N+N)-N',
        'N*(N-N)+N',
        'N*(N-N)-N',
        'N+(N+N)*N',
        'N-(N+N)*N',
        'N+(N-N)*N',
        'N-(N-N)*N'
     ],
     [
         'N/N+N/N',
         'N/N-N/N',
         'N/N*N/N'
     ],
     [
         'N*N/N',
         'N/N*N',
         'N/N*N/N',
         'N/N/N/N'
     ]
 ]