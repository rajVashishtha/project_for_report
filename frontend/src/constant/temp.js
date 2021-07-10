<Grid container direction="column" justify="center" alignItems="center" className={classes.margin}>
                    {
                    this.state.uploaded && (
                        <Grid item>
                            {/* <ReactPlayer pip={true} url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" controls={true} /> */}
                            <Grid container justify="center" alignItems="center" direction="column" spacing={3}>
                                <Grid item xs={10}>
                                    <Typography color="textSecondary" component="div">Preview for upload!</Typography>
                                </Grid>
                                <Grid item xs={11} sm={8} className="player-wrapper">
                                    <ReactPlayer pip={true} url={this.state.uploaded} controls={true} width="100%" height="100%" />
                                </Grid>
                            </Grid>
                        </Grid>
                    )
                    }
                        <Grid item >
                            
                            <div className={classes.buttonContainer} >
                                <div>
                                    <input
                                        accept="*"
                                        style={{ display: 'none' }}
                                        id="raised-button-file"
                                        type="file"
                                        value={this.state.filename}
                                        onChange={this.handleChange}
                                    />
                                    <label htmlFor="raised-button-file">
                                        <Button variant="outlined" component="span" color="primary">
                                            <CloudUploadOutlined style={{marginRight:"5px"}} />
                                            Upload
                                        </Button>
                                    </label>
                                </div>
                                <div>
                                    <TextField disabled value={this.state.filename} type="text" placeholder="No File Selected" className={classes.textfield} />
                                </div>
                            </div>
                        </Grid>   

                        <Grid item >
                        {
                            this.state.uploaded && (
                                <div style={{
                                    marginTop:"50px",
                                }}>
                                    <form style={{
                                        display:"flex",
                                        flexDirection:"column",
                                        marginLeft:"auto",
                                        marginRight:"auto",
                                        justifyContent:"center",
                                        alignItems:"center",
                                        padding:"20px 30px",
                                        border:`1px solid ${theme.palette.primary.main}`
                                    }} className={classes.form} >
                                        <Typography variant="h6" color="textSecondary" style={{
                                            marginBottom:'20px'
                                        }}>Enter Details</Typography>

                                        <FormControl style={{
                                            marginBottom:'20px',
                                        }} className={classes.textarea}>
                                            {/* <InputLabel htmlFor="my-input">Add Video Title</InputLabel>
                                            <Input  id="my-input" aria-describedby="video-title" /> */}
                                            <TextField name="title" value={this.state.title} required onChange={this.handleChangeText} variant="outlined" type="text" label="Add Video Title" />
                                            <FormHelperText id="video-title">Madatory *</FormHelperText>
                                        </FormControl>

                                        <FormControl style={{
                                            marginBottom:'20px',
                                        }} className={classes.textarea} variant="filled">
                                            <InputLabel htmlFor="category">Suggest Category</InputLabel>
                                            <Select
                                            native
                                            value={this.state.category}
                                            onChange={this.handleChange}
                                            inputProps={{
                                                name: 'category',
                                                id: 'category',
                                            }}
                                            >
                                            <option aria-label="None" value="" />
                                            <option value={10}>Ten</option>
                                            <option value={20}>Twenty</option>
                                            <option value={30}>Thirty</option>
                                            </Select>
                                        </FormControl>

                                        <TextareaAutosize aria-label="minimum height" style={{
                                            fontSize:theme.typography.fontSize+3,
                                            padding:"5px 10px"
                                        }} className={classes.textarea} name="description" value={this.state.description} onChange={this.handleChangeText} rowsMin={3} rowsMax={5} placeholder="Add video description" />
                                        <div style={{
                                            marginTop:"30px",width:"50%",justifyContent:"space-between",display:"flex",flexDirection:"row"
                                        }}>
                                            <Button onClick={this.handleClear} color="secondary" variant="contained">
                                                Clear
                                            </Button>
                                            <Button onClick={this.handleSubmit} type="submit" variant="contained" color="primary">
                                                Submit
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            )
                        }
                        </Grid>                 
                </Grid>











<Snackbar
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                    }}
                    open={this.state.overLimit}
                    autoHideDuration={6000}
                    onClose={this.toggleSnackBar}
                    message="Max Size 50 MB !"
                    action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={this.toggleSnackBar}>
                            <CloseOutlined fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                    }
                />