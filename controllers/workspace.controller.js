export async function renderWorkSpace(req, res){

    try{

        res.status(200).render('workspace-page');

    } catch (error) {

        res.status(400).json({ error: error.message });

    }

}