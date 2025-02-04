const Application = () => {
    return (
        <>
            <div class="container">
                <div class="row">
                    <div class="panel panel-primary filterable">
                        <div class="panel-heading">
                        </div>
                        <table class="table">
                            <thead>
                                <tr class="filters">
                                    <th><input type="text" class="form-control" placeholder="#" disabled /></th>
                                    <th><input type="text" class="form-control" placeholder="First Name" disabled /></th>
                                    <th><input type="text" class="form-control" placeholder="Last Name" disabled /></th>
                                    <th><input type="text" class="form-control" placeholder="Username" disabled /></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Mark</td>
                                    <td>Otto</td>
                                    <td>@mdo</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>Larry</td>
                                    <td>the Bird</td>
                                    <td>@twitter</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Application;
