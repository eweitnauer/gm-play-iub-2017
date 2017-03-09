g_matchExpressionFormat = [
    [
          '3x'
        , 'x3'
    ],
    [
          'x+y'
        , 'y+x'          
    ],
    [
          'x.y'
        , 'y.x'          
    ],
    [
          'x+y+z'
        , 'x+z+y'
        , 'y+x+z'
        , 'y+z+x'
        , 'z+x+y'
        , 'z+y+x'
    ],
    [
          'm*x+n*x'
        , 'm*x+x*n'
        , 'n*x+m*x'
        , 'n*x+x*m'
        , 'x*n+m*x'
        , 'x*n+x*m'
        , 'x*m+n*x'
        , 'x*m+x*n'
        , '(m+n)*x'
        , 'x*(m+n)'
        , '(n+m)*x'
        , 'x*(n+m)'
    ]
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
              'x+N=N'
            , 'x-N=N'
            , 'N*x=N'
            , 'x/N=N'
        ],
        [
              'Nx+N=N'
            , 'Nx=N+N'
            , 'x+x=N'
            , 'N=x+x'
        ]
        
    ]
     
g_simplifyExpressionFormat =[
         [
               'N*N'
             , 'N+N'
             , 'N/N'
             , 'N-N'
         ],
         
         [
               'N+N-N'
             , 'N+N*N'
             , 'N-N+N'
             , 'N/N*N'
             , 'N+N/N'
         ],
         
         [
               'N+N*N'
             , 'N*N+N'
             , 'N*N+N*N'
             , 
         ],
         [
               'N*(N+N)'
             , 'N+(N*N)'
             , '(N+N)*N'
             , '(N*N)+N'
         ]
     ]